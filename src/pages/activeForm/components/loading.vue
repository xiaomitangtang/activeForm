<template>
    <div class="loading loading-square-4" >
        <div class="loading-center">
            <div class="loading-center-absolute">
                <div class="object first_object" ></div>
                <div class="object second_object" ></div>
                <div class="object third_object" ></div>
                <div class="object forth_object" ></div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="less">
.loading-square-4 {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .loading {
    background-color: rgba(255, 255, 255, 1);
    height: 100%;
    width: 100%;
  }
  .loading-center {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .loading-center-absolute {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 100px;
    width: 100px;
    margin-top: -50px;
    margin-left: -50px;
  }
  .object {
    width: 25px;
    height: 25px;
    background-color: rgba(255, 255, 255, 0);
    margin-right: auto;
    margin-left: auto;
    border: 4px solid rgba(239, 74, 74, 1);
    left: 37px;
    top: 37px;
    position: absolute;
  }

  .first_object {
    -webkit-animation: first_object4 1s infinite;
    animation: first_object4 1s infinite;
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
  .second_object {
    -webkit-animation: second_object4 1s infinite;
    animation: second_object4 1s infinite;
  }
  .third_object {
    -webkit-animation: third_object4 1s infinite;
    animation: third_object4 1s infinite;
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
  .forth_object {
    -webkit-animation: forth_object4 1s infinite;
    animation: forth_object4 1s infinite;
  }

  @-webkit-keyframes first_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(150%, 150%) scale(2, 2);
      -webkit-transform: translate(150%, 150%) scale(2, 2);
      transform: translate(150%, 150%) scale(2, 2);
    }

    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }
  @keyframes first_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(150%, 150%) scale(2, 2);
      -webkit-transform: translate(150%, 150%) scale(2, 2);
      transform: translate(150%, 150%) scale(2, 2);
    }

    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }

  @-webkit-keyframes second_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(-150%, 150%) scale(2, 2);
      -webkit-transform: translate(-150%, 150%) scale(2, 2);
      transform: translate(-150%, 150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }
  @keyframes second_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(-150%, 150%) scale(2, 2);
      -webkit-transform: translate(-150%, 150%) scale(2, 2);
      transform: translate(-150%, 150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }

  @-webkit-keyframes third_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(-150%, -150%) scale(2, 2);
      -webkit-transform: translate(-150%, -150%) scale(2, 2);
      transform: translate(-150%, -150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }
  @keyframes third_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(-150%, -150%) scale(2, 2);
      -webkit-transform: translate(-150%, -150%) scale(2, 2);
      transform: translate(-150%, -150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }

  @-webkit-keyframes forth_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(150%, -150%) scale(2, 2);
      -webkit-transform: translate(150%, -150%) scale(2, 2);
      transform: translate(150%, -150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }
  @keyframes forth_object4 {
    0% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
    50% {
      -ms-transform: translate(150%, -150%) scale(2, 2);
      -webkit-transform: translate(150%, -150%) scale(2, 2);
      transform: translate(150%, -150%) scale(2, 2);
    }
    100% {
      -ms-transform: translate(1, 1) scale(1, 1);
      -webkit-transform: translate(1, 1) scale(1, 1);
      transform: translate(1, 1) scale(1, 1);
    }
  }
}
</style>
