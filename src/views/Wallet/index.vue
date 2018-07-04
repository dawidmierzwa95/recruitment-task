<template lang="pug">
  main.wallet
    .container
      .row.justify-content-center
        .col-6
          img.sign-in__logo.d-inline-block(src="~assets/logoHorizontal.svg",
          alt="Wallet: InventiStudio recruitment task", width="200")
        .col-6.pull-right.sign-out
          a(href='#', @click="signOut()") Sign out

      .row.justify-content-center.table
        .col-6.balance
          label Your wallet's balance is <strong>{{balance}}</strong>
        .col-6.pull-right.switch
          input(id="all", type="radio", name="type", value="all", v-model="type")
          label(for="all") All
          input(id="withdrawal", type="radio", name="type", value="withdrawal", v-model="type")
          label(for="withdrawal") Withdrawal
          input(id="additions", type="radio", name="type", value="additions", v-model="type")
          label(for="additions") Additions
        .col-12
          table
            tr.head
              th Added at
              th Title
              th Amount
              th
            tr(v-for="item in filteredByType")
              td {{item.createdAt.split('T')[0]}}
              td {{item.name}}
              td(:class="[(item.amount > 0 ? 'green' : 'red')]") {{item.amount}}
              td.pull-right
                img(src="~assets/more.svg",
                alt="More")
</template>

<script>
  import { mapActions } from 'vuex'
  import ls from 'local-storage'
  import { STORAGE_AUTH_TOKEN } from 'src/constants'
  import api from 'src/services/api'

  export default {
    name: 'Wallet',
    data: () => ({
      transactions: [],
      type: 'all',
    }),
    computed: {
      balance: function () {
        let result = 0;

        this.transactions.forEach((item) => {
          result += item.amount
        });

        return result;
      },
      filteredByType: function() {
        return this.transactions.filter((item) => {
          switch(this.type) {
            case 'all': return item
            case 'withdrawal': return item.amount<0
            case 'additions': return item.amount>0
          }
        });
      }
    },
    methods: {
      ...mapActions({
        logout: 'auth/logout',
      }),
      async getTransactions() {
        let token = ls.get(STORAGE_AUTH_TOKEN)

        if(!token) {
          return null
        }

        api.setHeader('x-auth-token', token)
        let data = await api.get('/transactions')
        this.$data.transactions = data.data.data //D-d-data!
      },
      async signOut() {
        try {
          await this.logout();
        } catch (err) {
          throw err
        }
      },
    },
    mounted() {
      this.getTransactions();
    }
  }
</script>

<style lang="sass" scoped>
  .wallet
    margin: 20px 0 0 0

    .balance
      strong
        color: #3991d0

    .table
      margin-top: 100px

    table
      margin: 25px 0 0 0
      width: 100%
      text-align: left
      border-spacing: 0
      tr.head
        background-color: #ffffff
        border-radius: 50px
      tr
        background-color: #f9f9f9
        border-bottom: 1px solid #f2f2f2
        td, th
          padding: 20px
          margin: 0

    .switch
      input
        position: absolute
        opacity: 0
        cursor: pointer
      input:checked + label
        background-color: #57b6ff
        color: #ffffff
      label
        display: inline
        background-color: #ffffff
        padding: 10px 20px
        cursor: pointer
      label:last-of-type
        border-radius: 0 5px 5px 0
      label:first-of-type
        border-radius: 5px 0 0 5px

    .pull-right
      text-align: right
      float: right

    .green
      color: #178657

    .red
      color: #ae4222

</style>
