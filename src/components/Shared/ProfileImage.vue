<template>
  <img
    :src="avatar"
    class="h-10 w-10 cursor-pointer rounded-3xl border-0 object-contain hover:shadow-blue-1"
    alt="userProfileImage"
    @contextmenu.prevent
    draggable="false"
  />
</template>

<script>
export default {
  name: "ProfileImage",
  props: {
    avatar: {
      type: String,
      required: true,
    },
  },
};
</script>
