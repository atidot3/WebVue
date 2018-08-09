<template>
    <div id="container">
        <section id="video-container">
			<video id="video" autoplay="autoplay"></video>
		</section>
        {{ param }}
    </div>
</template>
<script>
export default {
    name: 'Conference',
    props:
    {
        param: String,
    },
}
</script>
<style scoped>
#video-container
{
	width: 100%;
	float: left;
	background: black;
	padding: 0px;
	margin: 0px;
}
#video {
	width: 100%;
    height: 100%;
}
body, html {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	padding: 0px;
	margin: 0px;
	display: flex;
}
</style>
