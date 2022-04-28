<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="5" :xs="24">
          <user-card :active-menu.sync="activeMenu" />
        </el-col>

        <el-col :span="19" :xs="24">
          <el-card>
            <set-account v-show="activeMenu === 'account'" />
            <set-profile v-show="activeMenu === 'profile'" />
            <operation-log v-show="activeMenu === 'operationLog'" />
            <authenticate v-show="activeMenu === 'authenticate'" />
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userCard from './components/user-card'
import setAccount from './components/set-account'
import setProfile from './components/set-profile'
import operationLog from './components/operation-log'
import authenticate from './components/authenticate'

export default {
  name: 'Profile',
  components: { setAccount, setProfile, userCard, operationLog, authenticate },
  data() {
    return {
      activeMenu: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {

  },
  methods: {

  }
}
</script>
