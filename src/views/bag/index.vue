<template>
  <div class="notification-container">
    <el-tabs v-model="activeTab" tab-position="left">
      <el-tab-pane label="身份证" name="identityCard">
        <identity-card ref="identityCard" />
      </el-tab-pane>
      <el-tab-pane label="户口本" name="householdRegister">
        <household-register ref="householdRegister" />
      </el-tab-pane>
      <el-tab-pane label="驾驶证" name="drivingLicense">
        <driving-license ref="drivingLicense" />
      </el-tab-pane>
      <el-tab-pane label="行驶证" name="vehicleLicense">
        <vehicle-license ref="vehicleLicense" />
      </el-tab-pane>
      <el-tab-pane label="结婚证" name="marriageRegistration">
        <marriage-registration ref="marriageRegistration" />
      </el-tab-pane>
      <el-tab-pane label="产权证" name="ownershipCertificate">
        <ownership-certificate ref="ownershipCertificate" />
      </el-tab-pane>
      <el-tab-pane label="出生证" name="birthCertificate">
        <birth-certificate ref="birthCertificate" />
      </el-tab-pane>
      <el-tab-pane label="营业执照" name="businessLicense">
        <business-license ref="businessLicense" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import identityCard from './identity-card/index'
import drivingLicense from './driving-license/index'
import vehicleLicense from './vehicle-license/index'
import marriageRegistration from './marriage-registration/index'
import ownershipCertificate from './ownership-certificate/index'
import birthCertificate from './birth-certificate/index'
import businessLicense from './business-license/index'
import householdRegister from './household-register/index'
import { mapGetters } from 'vuex'

export default {
  name: 'Wallet',
  components: {
    identityCard,
    drivingLicense,
    vehicleLicense,
    marriageRegistration,
    ownershipCertificate,
    birthCertificate,
    businessLicense,
    householdRegister
  },
  data() {
    return {
      user: {},
      activeTab: 'identityCard'
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  watch: {
    activeTab(newValue) {
      this.currentValue = newValue
      // 刷新子组件数据
      this.$refs[newValue].loadTableData()
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.notification-container {
  padding: 20px;

  ::v-deep .el-card {
    margin: 0 !important;
    box-shadow: none;
    .el-card__body {
      padding: 0 !important;
    }
  }
}
</style>
