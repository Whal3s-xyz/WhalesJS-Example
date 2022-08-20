<script>
import Whales from 'whal3sjs'

export default {
  data() {
    return {
      log: [],
      utility: null,

      engagements: {},
      user: {
        isValid: false,
        engagements: {},
        maxEngagementsReached: false
      }
    }
  },
  created() {
    // fetch on init
    const whal3s = new Whales();
    this.utility = whal3s.getUtility('ab2c1796-7e27-4810-bc84-326b7d6decf3')
    this.utility.init()
    this.utility.addEventListener('initialized', () => this.log.push('initialized'))
    this.utility.addEventListener('initializationFailed', () => this.log.push('initializationFailed'))
    this.utility.addEventListener('dispatch', () => this.log.push('dispatch'))
    this.utility.addEventListener('networkSwitchFailed', () => this.log.push('networkSwitchFailed'))
    this.utility.addEventListener('sending', () => this.log.push('sending'))
    this.utility.addEventListener('sent', () => this.log.push('sent'))
    this.utility.addEventListener('transactionHash', (transactionHash) => this.log.push('transactionHash: ' + transactionHash))
    this.utility.addEventListener('confirmation', (data) => this.log.push('confirmation: ' + data.receipt))
    this.utility.addEventListener('error', (error) => this.log.push('error: ' + error.message))
    this.utility.addEventListener('done', (transactionHash) => this.log.push('error: ' + transactionHash))

    this.fetchEngagements()


  },
  computed: {
    selectedAccount() {
      return this.utility?.selectedAccount;
    }
  },
  methods: {
    async connectWallet() {
      await this.utility.connectWallet()
          .catch(function (error) {
            console.log(error)
          })
    },
    async triggerTransaction() {
      this.utility.performAction()
    },

    async fetchEngagements() {
      const engagements = await this.utility.fetchEngagements()
      console.log(engagements)
      this.engagements = engagements
    }


  },
  watch: {
    selectedAccount: function (value) {
      if (value)
        this.utility.validateWalletAddress()
            .then((reponse) => {
              this.user.isValid = reponse.valid
              this.user.maxEngagementsReached = reponse.maxEngagementsReached
              this.user.engagements = reponse.engagements
            })
      else
        this.isValid = false
    }
  }
}
</script>

<template>

  <main>
    <div class="min-h-full">
      <div class="bg-gray-800 pb-32">
        <nav class="bg-gray-800">
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="border-b border-gray-700">
              <div class="flex items-center justify-between h-16 px-4 sm:px-0">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="w-16" src="/logo.png"
                         alt="Whal3s">
                  </div>
                </div>

              </div>
            </div>
          </div>

        </nav>
        <header class="py-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div class="flex justify-between">
              <h1 class="text-3xl font-bold text-white">API Test</h1>
              <button
                  v-if="!utility.selectedAccount"
                  @click="connectWallet" type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Connect Wallet
              </button>
              <button
                  v-if="utility.selectedAccount && !user.maxEngagementsReached"
                  @click="triggerTransaction" type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Whitelist me
              </button>
              <span v-if="utility.selectedAccount && user.isValid"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"> Already on Whitelist </span>

            </div>
            <div class="flex justify-end">
              <span class="text-white">{{ selectedAccount }}</span>
            </div>

          </div>

        </header>
      </div>

      <main class="-mt-32" id="app">
        <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div class="col-span-1 lg:col-span-2">
              <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                <!-- This example requires Tailwind CSS v2.0+ -->
                <div>
                  <div class="flow-root mt-6">
                    <ul role="list" class="-my-5 divide-y divide-gray-200">
                      <li v-for="engagement in engagements" class="py-4" :key="engagement.id">
                        <div class="flex items-center space-x-4">

                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ engagement.transaction_hash }}</p>
                          </div>
                          <div>
                            <a href="#"
                               class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                              View </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>
            <div class="col-span-1 lg:col-span-1">
              <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                <p v-for="(entry, index) in log" v-html="entry" :key="'log'+index"></p>
              </div>
            </div>
          </div>

          <!-- /End replace -->
        </div>
      </main>
    </div>

  </main>
</template>

<style scoped>

</style>
