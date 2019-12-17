<template>
    <v-layout row wrap>
        <v-flex d-flex sm7>
            <v-layout row wrap>
                <v-flex >
                    <v-layout row wrap>
                        <v-flex d-flex
                                xs12>
                            <StatsIcon></StatsIcon>
                        </v-flex>
                        <v-flex d-flex
                                xs12>
                            <v-card>
                                <v-card-title class="pb-0">
                                    <span class="title font-weight-light">Monthly statistics</span>
                                </v-card-title>
                                <v-card-text class="pt-0">
                                    <StatsCurve></StatsCurve>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex d-flex
                                xs12>
                            <v-card>
                                <v-card-title class="pb-0">
                                    <span class="title font-weight-light">Reminder</span>
                                </v-card-title>
                                <v-card-text>
                                    <Todo></Todo>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex d-flex sm5>
            <History></History>
        </v-flex>
    </v-layout>
</template>

<script>

    import StatsIcon from './components/statsIcon/statsIcon'
    import Todo from './components/todo/todo'
    import History from './components/history/history'
    import StatsCurve from './components/statsCurve/statsCurve'

    export default {
        components: {
            StatsIcon,
            StatsCurve,
            Todo,
            History
        },
        data: () => ({
            dialogAdd: false
        }),
        mounted() {

        },
        methods:{

        }
    }
</script>

<style>

</style>
