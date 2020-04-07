<template>
    <div>
        <el-dialog
        title="添加好友"
        :visible.sync="showSearchFriendDialog"
        width="30%"
        :show-close="true"
        center>
        <el-input v-model="friendInput" prefix-icon="el-icon-search" placeholder="请输入手机号码或昵称"></el-input>
        <el-table
            :data="friendData"
            :show-header="false"
            :fit="true"
            :highlight-current-row="false"
            style="width: 100%;margin-top:10px">
            <el-table-column
                prop="image"
                label="头像"
                width="50"
                >
                <template slot-scope="scope">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
                <template>
                    <div>
                        <p>13269013653</p>
                        <p>北京 北京市</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="加好友"
                align="right"
                >
                <template>
                    <i class="icon iconfont icon-pengyou"></i>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button class="search-friend-btn" size="medium" type="info" plain round @click="changeSearchFriendDialog">取 消</el-button> -->
            <!-- <el-button class="search-friend-btn"  size="medium" type="success" plain round @click="changeSearchFriendDialog">确 定</el-button> -->
        </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data() {
        return {
            friendInput: '',
            friendData: [{
                image: '2016-05-02',
                name: '王小虎'
            }]
        }
    },
    methods: {
      changeSearchFriendDialog(){
        this.$store.state.showSearchFriendDialog = false;
      }
   },
   computed: {
     showSearchFriendDialog : {
         get () {
             return this.$store.state.showSearchFriendDialog;
         },
         set(val) {
             this.$store.state.showSearchFriendDialog = val;
         }
     }
   }
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
}

.el-dialog__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-friend-btn {
   width: 100%;
   height: 35px;
}

</style>