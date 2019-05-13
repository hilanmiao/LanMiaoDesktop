<template>
    <v-layout>
        <v-btn
                color="orange"
                fixed
                bottom
                right
                fab
                @click="dialogShow = true"
        >
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialogShow" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-select
                                        :items="['Breakfast', 'Lunch', 'Dinner']"
                                        label="Category*"
                                        required
                                ></v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Money*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                        label="Remark"
                                        hint="Hint text"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialogShow = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="dialogShow = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "add",
        data: () => ({
            dialogShow: false
        }),
        watch: {
            '$store.state.dialogAdd.dialogAddShow'(newVal) {
                this.dialogShow = newVal
            },
            dialogShow(newVal) {
                this.updateDialog(newVal)
            }
        },
        // computed: {
        //     dialogShow: {
        //         get() {
        //             console.log('computed get ')
        //             return this.$store.getters.dialogAddShow
        //         },
        //         set(value) {
        //             alert('computed set ' + value)
        //             this.updateDialog(value)
        //         }
        //     }
        // },
        mounted() {

        },
        methods: {
            ...mapActions([
                'updateDialog',
            ]),
        }
    }
</script>

<style scoped>

</style>