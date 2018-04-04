<template>
    <div class="intro-wrapper">
        <canvas></canvas>
        <div class="info-wrapper">
            <h1><a href="">lan miao</a></h1>
                <h2>Laziness is an attitude</h2>
            <p><a href="http://lanmiao.oschina.io/" target="_blank">Blog</a></p>
            <p><a href="https://github.com/hilanmiao" target="_blank">Github</a></p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        created() {

        },
        mounted() {
            this.initCanvas()
        },
        methods: {
            initCanvas() {
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault()
                })
                const c = document.getElementsByTagName('canvas')[0]
                const x = c.getContext('2d')
                const pr = window.devicePixelRatio || 1
                const w = window.innerWidth
                const h = window.innerHeight
                const f = 90
                let q
                const m = Math
                let r = 0
                const u = m.PI * 2
                const v = m.cos
                const z = m.random
                c.width = w * pr
                c.height = h * pr
                x.scale(pr, pr)
                x.globalAlpha = 0.6

                function i() {
                    x.clearRect(0, 0, w, h)
                    q = [{x: 0, y: h * 0.7 + f}, {x: 0, y: h * 0.7 - f}]
                    while (q[1].x < w + f) d(q[0], q[1])
                }

                function d(i, j) {
                    x.beginPath()
                    x.moveTo(i.x, i.y)
                    x.lineTo(j.x, j.y)
                    const k = j.x + (z() * 2 - 0.25) * f
                    const n = y(j.y)
                    x.lineTo(k, n)
                    x.closePath()
                    r -= u / -50
                    x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16)
                    x.fill()
                    q[0] = q[1]
                    q[1] = {x: k, y: n}
                }

                function y(p) {
                    const t = p + (z() * 2 - 1.1) * f
                    return (t > h || t < 0) ? y(p) : t
                }

                document.onclick = i
                document.ontouchstart = i
                i()
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .intro-wrapper {
        font-family: 'Open Sans', 'Helvetica Neue', 'Hiragino Sans GB', 'LiHei Pro', Arial, sans-serif
        color: #333
        overflow: hidden
        height: 100%
        width: 100%
        position: absolute
        .info-wrapper {
            position: absolute
            width: 320px
            top: 50%
            left: 50%
            text-align: center
            margin-top: -160px
            margin-left: -160px
            h1 {
                font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif
                font-weight: 700
                font-size: 35px
                letter-spacing: 9px
                text-transform: uppercase
                margin: 12px 0
                left: 4px
                a {
                    color: #333
                    text-decoration: none
                }
            }
            h2 {
                color: #999
                /*font-weight: normal*/
                font-size: 15px
                letter-spacing: .12em
                margin-bottom: 30px
                left: 3px
            }
            p {
                font-size: 14px
                line-height: 2em
                margin: 0
                letter-spacing: 2px
                font-weight: bold
                a {
                    color: #999;
                    text-decoration: none;
                    transition: color .2s ease;
                }
            }
        }
    }
</style>
