<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
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
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            dialog: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        name: "add",
        data: () => ({
            // dialog: false
        })
    }
</script>

<style scoped>

</style>
