<template>
  <div class="user-container">
    <div class="header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="请输入用户名或邮箱搜索"
        style="width: 300px"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <el-table :data="userList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 添加/编辑用户对话框 -->
    <user-form
      v-model="dialogVisible"
      :user="currentUser"
      :is-edit="isEdit"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import UserForm from './UserForm.vue';
import { getUserList, deleteUser } from '@/api/userApi';
import type { User } from '@/types/user';

const loading = ref(false);
const userList = ref<User[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchQuery = ref('');
const dialogVisible = ref(false);
const currentUser = ref<Partial<User>>({});
const isEdit = ref(false);

// 获取用户列表
const fetchUserList = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value
    };
    const res = await getUserList(params);
    userList.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchUserList();
};

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchUserList();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchUserList();
};

// 添加用户
const handleAdd = () => {
  currentUser.value = {};
  isEdit.value = false;
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (user: User) => {
  currentUser.value = { ...user };
  isEdit.value = true;
  dialogVisible.value = true;
};

// 删除用户
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        await deleteUser(id);
        ElMessage.success('删除成功');
        fetchUserList();
      } catch (error) {
        console.error('删除用户失败:', error);
        ElMessage.error('删除用户失败');
      }
    })
    .catch(() => {});
};

// 添加/编辑成功回调
const handleSuccess = () => {
  dialogVisible.value = false;
  fetchUserList();
};

onMounted(() => {
  fetchUserList();
});
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
