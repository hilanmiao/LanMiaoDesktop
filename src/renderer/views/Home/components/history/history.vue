<template>
    <v-layout class="mt-3">
        <v-flex d-flex class="pa-0">
            <v-card
            >
                <v-sheet
                        class="v-sheet--offset mx-auto pa-2"
                        color="orange"
                        elevation="12"
                        max-width="calc(100% - 32px)"
                >
                    <h1>History</h1>
                    <span>Here is every pay</span>
                </v-sheet>
                <v-card-text class="pt-0 title font-weight-bold">
                    <v-data-table
                            hide-actions
                            :headers="headers"
                            :items="desserts"
                    >
                        <template v-slot:items="props">
                            <td>{{ props.item.date }}</td>
                            <td>{{ props.item.category }}</td>
                            <td>{{ props.item.money }}</td>
                        </template>
                    </v-data-table>
                    <v-btn
                            block
                            class="mt-3"
                            depressed
                            round
                    >
                        load more
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "list",
        data () {
            return {
                headers: [
                    {
                        text: 'Date',
                        align: 'left',
                        sortable: false,
                        value: 'date'
                    },
                    { text: 'Category',sortable: false, value: 'category' },
                    { text: 'Money', sortable: false,value: 'money' },
                ],
                desserts: [
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    },
                    {
                        date: '2019-04-20 12:59:59',
                        category: 'lunch',
                        money: 11.5,
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .v-sheet--offset {
        top: -15px;
        position: relative;
    }
</style>
