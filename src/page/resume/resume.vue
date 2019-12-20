<template>
	<div class="resume">
		<div class="about">
			<h1 class="name">韩超男</h1>
			<div class="intention">求职意向：</br><span>web前端工程师</span></div>
			<div class="info">
			    <div class="info-title">个人信息：</div>
				<div class="info-item">
					<i class="icon school"></i>
					<span>东华理工大学(本科)</span>
				</div>
				<div class="info-item">
					<i class="icon major"></i>
					<span>软件工程(2018毕业)</span>
				</div>
				<div class="info-item">
					<i class="icon phone"></i>
					<span>18174019297</span>
				</div>
				<div class="info-item">
					<i class="icon email"></i>
					<span>1062384845@qq.com</span>
				</div>
			</div>
		</div>
		<div class="power">
			<div class="power-item">
                <div class="title">
                    <i class="icon technology"></i>
                    <span class="name">技术栈</span>
                </div>
                <div class="technology-item">
                    <span>【前端】</span>HTML/HTML5 &nbsp CSS/CSS3 &nbsp JavaScript(ES6,ES5) &nbsp SASS &nbsp Stylus &nbsp Vue.JS &nbsp AJAX &nbsp jQuery &nbsp 微信小程序 &nbsp Babel
                </div>
                <div class="technology-item">
                    <span>【后端】</span>Node.js (express)
                </div>
                <div class="technology-item">
                    <span>【数据库】</span>MongoDB
                </div>
                <div class="technology-item">
                    <span>【自动化构建】</span>Webpack
                </div>
                <div class="technology-item">
                    <span>【版本管理】</span>git
                </div>         
            </div>
            <div class="power-item">
                <div class="title">
                    <i class="icon evaluation"></i>
                    <span class="name">个人评价</span>
                </div>
                <div class="myevaluation">本人是软件学院的学生，在校学习了多门编程语言，有良好的编程思想。除了学校课程
                   以外自学能力较强，能独立思考，独立解决问题，也会经常逛技术社区，学习好的分享技术.技术发展太快，我会以更开发的心态去接受新技术，不断扩展自己。我相信自己可以做好本职工作。我相信自己可以很快的融入公司的技术团队。
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	export default {

	}
</script>

<style lang="stylus" scoped>
.resume
    display: flex
    height: 100%
    .about
        width: 250px
        background-color: rgb(36,70,100)
        padding: 10px
        box-sizing: border-box
        color: #fff
        .name
            text-align: center
            margin: 20px auto 40px
            font-size: 28px
            font-weight: 600
        .intention
            font-size: 20px
            span
                display: block
                text-align: right
                font-size: 16px
                line-height: 18px
                margin: 20px 0
                letter-spacing: 1px
        .info
            .info-title
                font-size: 20px
            .info-item
                display: flex
                margin: 10px 0 20px 0
                height: 40px
                line-height: 40px
                .icon
                    width: 40px
                    height: 40px
                    background-color: #fff
                    border-radius: 50%
                    margin-right: 20px
                    background-position: center
                    background-repeat: no-repeat
                    background-size: 26px
                    &.school
                        background-image: url(school.png)
                    &.major
                        background-image: url(major.png)
                    &.phone
                        background-image: url(phone.png)
                        background-size: 32px
                    &.email
                        background-image: url(email.png)
    .power
        flex: 1
        overflow-y: auto
        padding: 70px 50px 30px 50px
        background-color: #fff
        .power-item
            color: rgb(36,70,100)
            .title
                display: flex
                margin-bottom: 20px
                .icon
                    display: inline-block
                    width: 50px
                    height: 50px
                    background-color: rgb(36,70,100)
                    border-radius: 50%
                    margin-right: 10px
                    background-position: center
                    background-repeat: no-repeat
                    background-size: 30px
                    &.technology
                        background-size: 35px
                        background-image: url(technology.png)
                    &.evaluation
                        background-image: url(evaluation.png)
                .name
                    flex: 1
                    display: inline-block
                    height: 50px
                    font-size: 24px
                    font-weight: 600
                    line-height: 50px
                    box-sizing: border-box
                    border-bottom: 2px solid rgb(36,70,100)
            .technology-item
                margin: 20px auto
                font-size: 14px
                line-height: 25px
                display: flex
                span
                    display: inline-block
                    font-size: 18px

</style>