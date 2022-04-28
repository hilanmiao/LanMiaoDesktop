<template>
  <div class="loading-container">
    <div class="cube-title">Smart Miao</div>
    <div class="cube-wrapper">
      <div class="cube-folding">
        <span class="leaf1" />
        <span class="leaf2" />
        <span class="leaf3" />
        <span class="leaf4" />
      </div>
      <span class="loading" data-name="Loading">Loading</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Loading',
  props: {
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    click() {
      this.$router.push({ path: '/profile/notification' })
    }
  }
}
</script>

<style lang="scss" scoped>
.cube-container {
  width: 100%;
  height: 100%;
  //background: #00c6ff;
  ///* fallback for old browsers */
  //background: -webkit-linear-gradient(to left, #00c6ff, #0072ff);
  ///* Chrome 10-25, Safari 5.1-6 */
  //background: linear-gradient(to left, #00c6ff, #0072ff);
  ///* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  //font-family: arial;
}
.cube-title {
  position: fixed;
  left: 50%;
  top: 35%;
  margin-top: -50px;
  margin-left: -150px;
  width: 300px;
  height: 100px;
  text-align: center;
  font-size: 26px;
  color: #409EFF;
  font-weight: 300;
}
.cube-folding {
  width: 50px;
  height: 50px;
  display: inline-block;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
  font-size: 0;
}
.cube-folding span {
  position: relative;
  width: 25px;
  height: 25px;
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  transform: scale(1.1);
  display: inline-block;
}
.cube-folding span::before {
  content: "";
  background-color: #409EFF;
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 25px;
  height: 25px;
  -moz-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  -webkit-animation: folding 2.5s infinite linear both;
  -moz-animation: folding 2.5s infinite linear both;
  animation: folding 2.5s infinite linear both;
}
.cube-folding .leaf2 {
  -webkit-transform: rotateZ(90deg) scale(1.1);
  -moz-transform: rotateZ(90deg) scale(1.1);
  transform: rotateZ(90deg) scale(1.1);
}
.cube-folding .leaf2::before {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
  background-color: #f2f2f2;
}
.cube-folding .leaf3 {
  -webkit-transform: rotateZ(270deg) scale(1.1);
  -moz-transform: rotateZ(270deg) scale(1.1);
  transform: rotateZ(270deg) scale(1.1);
}
.cube-folding .leaf3::before {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
  background-color: #f2f2f2;
}
.cube-folding .leaf4 {
  -webkit-transform: rotateZ(180deg) scale(1.1);
  -moz-transform: rotateZ(180deg) scale(1.1);
  transform: rotateZ(180deg) scale(1.1);
}
.cube-folding .leaf4::before {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
  background-color: #e6e6e6;
}

@-webkit-keyframes folding {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    -moz-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
  25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    -moz-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
  }
  90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    -moz-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
}
@-moz-keyframes folding {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    -moz-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
  25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    -moz-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
  }
  90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    -moz-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
}
@-ms-keyframes folding {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    -moz-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
  25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    -moz-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
  }
  90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    -moz-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
}
@keyframes folding {
  0%, 10% {
    -webkit-transform: perspective(140px) rotateX(-180deg);
    -moz-transform: perspective(140px) rotateX(-180deg);
    transform: perspective(140px) rotateX(-180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
  25%, 75% {
    -webkit-transform: perspective(140px) rotateX(0deg);
    -moz-transform: perspective(140px) rotateX(0deg);
    transform: perspective(140px) rotateX(0deg);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
  }
  90%, 100% {
    -webkit-transform: perspective(140px) rotateY(180deg);
    -moz-transform: perspective(140px) rotateY(180deg);
    transform: perspective(140px) rotateY(180deg);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
  }
}
.cube-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
  text-align: center;
}
.cube-wrapper:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20px;
  margin: auto;
  width: 90px;
  height: 6px;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.1);
  -webkit-filter: blur(2px);
  filter: blur(2px);
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  -webkit-animation: shadow 0.5s ease infinite alternate;
  -moz-animation: shadow 0.5s ease infinite alternate;
  animation: shadow 0.5s ease infinite alternate;
}
.cube-wrapper .loading {
  font-size: 12px;
  letter-spacing: 0.1em;
  display: block;
  color: #409EFF;
  position: relative;
  top: 25px;
  z-index: 2;
  -webkit-animation: text 0.5s ease infinite alternate;
  -moz-animation: text 0.5s ease infinite alternate;
  animation: text 0.5s ease infinite alternate;
}

@-webkit-keyframes text {
  100% {
    top: 35px;
  }
}
@-moz-keyframes text {
  100% {
    top: 35px;
  }
}
@-ms-keyframes text {
  100% {
    top: 35px;
  }
}
@keyframes text {
  100% {
    top: 35px;
  }
}
@-webkit-keyframes shadow {
  100% {
    bottom: -18px;
    width: 100px;
  }
}
@-moz-keyframes shadow {
  100% {
    bottom: -18px;
    width: 100px;
  }
}
@-ms-keyframes shadow {
  100% {
    bottom: -18px;
    width: 100px;
  }
}
@keyframes shadow {
  100% {
    bottom: -18px;
    width: 100px;
  }
}
</style>
