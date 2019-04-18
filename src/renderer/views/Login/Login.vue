<template>
    <v-card
            class="mt-3 mx-auto"
            max-width="300"
            width="300"
    >
        <v-sheet
                class="v-sheet--offset mx-auto text-xs-center pa-2"
                color="orange"
                elevation="12"
                max-width="calc(100% - 32px)"
        >
            <h1 class="">Log in</h1>
            <v-flex>
                <v-btn small flat icon>
                    <v-icon>filter_1</v-icon>
                </v-btn>
                <v-btn small flat icon>
                    <v-icon>filter_2</v-icon>
                </v-btn>
                <v-btn small flat icon>
                    <v-icon>filter_3</v-icon>
                </v-btn>
            </v-flex>
        </v-sheet>

        <v-card-text class="px-4">
            <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
            >
                <v-text-field
                        v-model="name"
                        :counter="10"
                        :rules="nameRules"
                        label="Name"
                        required
                ></v-text-field>

                <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'visibility' : 'visibility_off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Normal with hint text"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                ></v-text-field>

                <v-btn
                        flat
                        block
                        color="orange"
                        class="mt-4"
                        @click="validate"
                >
                    lets go
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters'
            ],
            show1: false,
            password: 'Password',
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => ('The email and password you entered don\'t match')
            }
        }),
        methods: {
            validate () {
                if (this.$refs.form.validate()) {

                }
            }
        }
    }
</script>

<style scoped >
    .v-sheet--offset {
        top: -24px;
        position: relative;
    }

    .v-input {
        height: 70px;
    }
</style>
