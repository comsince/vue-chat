<template>
    <div class="addfrind">
        <el-dialog
        title="添加好友"
        :visible.sync="showSearchFriendDialog"
        width="30%"
        :show-close="true"
        @close="handleClose"
        center>

        <el-dialog
          width="30%"
          title="添加好友"
          :visible.sync="innerVisible"
          append-to-body>
          <el-input  
             type="textarea"
             :rows="3"
             v-model="friendRequest"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="info" plain round @click="innerVisible=false">取 消</el-button>
            <el-button size="medium" type="success" plain round @click="sendFriendRequest">确 定</el-button>
        </span>   
        </el-dialog>

        <el-input v-model="friendInput" prefix-icon="el-icon-search" placeholder="请输入手机号码或昵称" @keydown.enter.native="searchUser"></el-input>
        <el-table
            :data="searchUsers"
            :show-header="false"
            :fit="true"
            :highlight-current-row="false"
            max-height="300"
            style="width: 100%;margin-top:10px">
            <el-table-column
                prop="image"
                label="头像"
                width="50"
                >
                <template slot-scope="scope">
                    <el-avatar :src="scope.row.portrait"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
                <template slot-scope="scope">
                    <div>
                        <p>{{scope.row.displayName}}</p>
                        <p>{{scope.row.mobile}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="加好友"
                align="right">
                <template slot-scope="scope">
                    <i class="icon iconfont icon-jiahaoyou" @click="showFriendRequestDialog(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button class="search-friend-btn" size="medium" type="info" plain round @click="changeSearchFriendDialog">取 消</el-button>
            <el-button class="search-friend-btn"  size="medium" type="success" plain round @click="changeSearchFriendDialog">确 定</el-button>
        </span> -->
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data() {
        return {
            friendInput: '',
            friendRequest: '',
            currentSearchUser: null,
            innerVisible: false
        }
    },
    methods: {
      changeSearchFriendDialog(){
        this.$store.state.showSearchFriendDialog = false;
      },
      searchUser(e){
         console.log("search user ");
         if(e.keyCode === 13 && this.friendInput != ""){
            this.$store.dispatch('searchUser', this.friendInput);
            this.friendInput = '';
         }
      },
      handleClose(){
          this.$store.dispatch('updateSearchUser', []);
      },
      sendFriendRequest(){
          this.innerVisible=false;
          this.$store.dispatch("sendFriendAddRequest",{
            reason: this.friendRequest,
            targetUserId: this.currentSearchUser.uid
        });
      },
      showFriendRequestDialog(currentSearchUser){
        this.innerVisible=true;
        this.friendRequest = "我是"+this.$store.state.user.name;
        this.currentSearchUser = currentSearchUser;
      }
   },
   computed: {
     ...mapState([
          'searchUsers',
        ]),
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
.addfrind .icon {
   display: inline-block;
   font-size: 26px; 
   color: rgb(0,220,65);
}
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
   width: 50%;
   height: 35px;
}

</style>