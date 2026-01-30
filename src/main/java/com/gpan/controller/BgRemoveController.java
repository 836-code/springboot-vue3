package com.gpan.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/api/bg")
public class BgRemoveController {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 前端上传图片 → 去背景 → 返回透明 PNG
     */
    @PostMapping("/remove")
    public ResponseEntity<byte[]> removeBackground(@RequestParam("file") MultipartFile file) throws Exception {

        // 1. 保存临时文件
        File tempFile = File.createTempFile("upload-", ".png");
        file.transferTo(tempFile);

        // 2. 上传到 ComfyUI，并获取真实文件名
        String uploadedFileName = uploadToComfyUI(tempFile);

        // 3. 构造 workflow（动态替换文件名）
        Map<String, Object> workflow = buildWorkflow(uploadedFileName);

        // 4. 提交 workflow
        String promptId = submitWorkflow(workflow);

        // 5. 等待 ComfyUI 处理完成，获取输出文件名
        String outputFileName = waitForResult(promptId);

        // 6. 下载处理后的图片
        byte[] resultImage = downloadFromComfyUI(outputFileName);

        // 7. 返回给前端
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(resultImage, headers, HttpStatus.OK);
    }


    /**
     * 上传图片到 ComfyUI
     */
    private String uploadToComfyUI(File file) {
        String url = "http://127.0.0.1:8188/upload/image";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new FileSystemResource(file));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        Map response = restTemplate.postForObject(url, request, Map.class);

        return (String) response.get("name"); // ComfyUI 返回的真实文件名
    }


    /**
     * 构造 workflow JSON（Java 8 兼容）
     */
    private Map<String, Object> buildWorkflow(String filename) {

        // 节点 11：AutoDownloadBiRefNetModel
        Map<String, Object> node11 = new HashMap<>();
        node11.put("class_type", "AutoDownloadBiRefNetModel");
        Map<String, Object> inputs11 = new HashMap<>();
        inputs11.put("model_name", "General");
        inputs11.put("device", "AUTO");
        inputs11.put("dtype", "float32");
        node11.put("inputs", inputs11);

        // 节点 3：LoadImage
        Map<String, Object> node3 = new HashMap<>();
        node3.put("class_type", "LoadImage");
        Map<String, Object> inputs3 = new HashMap<>();
        inputs3.put("image", filename); // 动态文件名
        node3.put("inputs", inputs3);

        // 节点 9：RembgByBiRefNet
        Map<String, Object> node9 = new HashMap<>();
        node9.put("class_type", "RembgByBiRefNet");
        Map<String, Object> inputs9 = new HashMap<>();
        inputs9.put("model", Arrays.asList("11", 0));
        inputs9.put("images", Arrays.asList("3", 0));
        node9.put("inputs", inputs9);

        // 节点 20：SaveImage
        Map<String, Object> node20 = new HashMap<>();
        node20.put("class_type", "SaveImage");
        Map<String, Object> inputs20 = new HashMap<>();
        inputs20.put("images", Arrays.asList("9", 0));
        inputs20.put("filename_prefix", "output");
        node20.put("inputs", inputs20);

        // prompt
        Map<String, Object> prompt = new HashMap<>();
        prompt.put("11", node11);
        prompt.put("3", node3);
        prompt.put("9", node9);
        prompt.put("20", node20);

        Map<String, Object> workflow = new HashMap<>();
        workflow.put("prompt", prompt);

        return workflow;
    }


    /**
     * 提交 workflow
     */
    private String submitWorkflow(Map<String, Object> workflow) {
        String url = "http://127.0.0.1:8188/prompt";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(workflow, headers);

        Map response = restTemplate.postForObject(url, request, Map.class);

        return (String) response.get("prompt_id");
    }


    /**
     * 轮询等待 ComfyUI 输出
     */
    private String waitForResult(String promptId) throws Exception {
        String url = "http://127.0.0.1:8188/history/" + promptId;

        for (int i = 0; i < 60; i++) { // 最多等 60 秒
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            Map history = (Map) response.getBody().get(promptId);
            if (history != null && history.containsKey("outputs")) {

                Map outputs = (Map) history.get("outputs");
                Map saveNode = (Map) outputs.get("20"); // SaveImage 节点 ID

                if (saveNode != null) {
                    List<Map> images = (List<Map>) saveNode.get("images");
                    if (!images.isEmpty()) {
                        return (String) images.get(0).get("filename");
                    }
                }
            }

            Thread.sleep(1000);
        }

        throw new RuntimeException("ComfyUI 处理超时");
    }


    /**
     * 下载 ComfyUI 输出的图片
     */
    private byte[] downloadFromComfyUI(String filename) {
        String url = "http://127.0.0.1:8188/view?filename=" + filename + "&type=output";
        return restTemplate.getForObject(url, byte[].class);
    }
}
