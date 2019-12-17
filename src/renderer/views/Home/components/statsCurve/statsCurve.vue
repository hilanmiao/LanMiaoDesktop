<template>
    <v-sparkline
            :labels="label"
            :value="value"
            :gradient="gradient"
            :smooth="radius || false"
            :padding="padding"
            :line-width="width"
            :stroke-linecap="lineCap"
            :gradient-direction="gradientDirection"
            color="white"

            auto-draw
    ></v-sparkline>
</template>

<script>
    const gradients = [
        ['#222'],
        ['#42b3f4'],
        ['red', 'orange', 'yellow'],
        ['purple', 'violet'],
        ['#00c6ff', '#F0F', '#FF0'],
        ['#f72047', '#ffd200', '#1feaea']
    ]
    const labels = [
        'Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'
    ]
    const values = [
        6367.3,5208,5233,5618.6,5419.5,5208,5233,5618.6,5419.5,5208,5233,5618.6
    ]
    export default {
        name: "curve",
        data: () => ({
            width: 2,
            radius: 10,
            padding: 10,
            lineCap: 'round',
            gradient: gradients[5],
            value: values,
            label: labels,
            gradientDirection: 'top',
            gradients
        })
    }
</script>

<style scoped>

</style>
