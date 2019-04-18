<template>
    <v-layout class="mt-3">
        <v-flex v-for="(item, key) in stats">
            <v-card
            >
                <v-sheet
                        class="v-sheet--offset"
                        :color="item.color"
                        elevation="12"
                        width="80"
                        height="80"

                >
                    <v-layout fill-height>
                        <v-flex d-flex align-center text-xs-center>
                            <v-icon x-large color="white">{{item.icon}}</v-icon>
                        </v-flex>
                    </v-layout>
                </v-sheet>
                <span class="money font-weight-bolod display-1">${{item.money}}</span>
                <v-card-text class="pt-0 title font-weight-bold">
                    Today Income
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
    export default {
        name: "statsIcon",
        data: () => ({
            stats: [
                {
                    icon: 'equalizer',
                    money: '6800',
                    text: 'Today Income',
                    color: 'orange'
                },
                {
                    icon: 'equalizer',
                    money: '6800',
                    text: 'Today Income',
                    color: 'purple'
                },
                {
                    icon: 'equalizer',
                    money: '6800',
                    text: 'Today Income',
                    color: 'green'
                }
            ]
        })
    }
</script>

<style scoped>
    .v-sheet--offset {
        top: -15px;
        left: 15px;
    }

    .money {
        position: absolute;
        top: 0;
        right: 0;
        padding: 15px;
    }
</style>
