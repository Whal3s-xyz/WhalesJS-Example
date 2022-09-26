<script>
import Whal3s from 'whal3sjs'

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
    const whal3s = new Whal3s();
    this.utility = whal3s.getUtility('0925733e-3b31-4be9-8f84-cb43cf8ea73e')
    this.utility.init()
    this.utility.addEventListener('initialized', () => this.log.push('initialized'))
    this.utility.addEventListener('initializationFailed', () => this.log.push('initializationFailed'))
    this.utility.addEventListener('networkSwitch', () => this.log.push('networkSwitch'))
    this.utility.addEventListener('networkSwitchFailed', () => this.log.push('networkSwitchFailed'))
    this.utility.addEventListener('sending', () => this.log.push('sending'))
    this.utility.addEventListener('sent', () => this.log.push('sent'))
    this.utility.addEventListener('transactionHash', (transactionHash) => this.log.push('transactionHash: ' + transactionHash))
    this.utility.addEventListener('confirmation', (data) => this.log.push('confirmation: ' + data.receipt))
    this.utility.addEventListener('error', (error) => this.log.push('error: ' + error.message))
    this.utility.addEventListener('done', (transactionHash) => this.log.push('done: ' + transactionHash))
    this.utility.addEventListener('estimateGasError', () => this.log.push("Cannot estimate gas. Maybe token balance to low."))
    this.utility.addEventListener('gasPriceError', () => this.log.push("Cannot fetch gas price"))

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
            console.log({error: error})
          })
    },
    async triggerTransaction() {
      this.utility.performAction().catch(function (error) {
        console.log(error.code)
        if (error.code === 3)
          alert('Not enough token')
        console.log(error)
      })
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
            <div class="grid grid-cols-12">
              <div class="col-span-12 md:col-span-6">
              <h1 class="text-3xl font-bold text-white">Onchain Events</h1>
                <p class="text-white text-xl mt-2.5">This example triggers the transfer method on the Fire Token Contract and creates an engagement if the Transfer event got triggered on the blockchain</p>

              </div>


            </div>

          </div>

        </header>
        <div class="py-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- This example requires Tailwind CSS v2.0+ -->
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Condition</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Smart Contract Event</p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl class="sm:divide-y sm:divide-gray-200">
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Blockchain</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Matic Mainnet</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Contract Address</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0x502f6e93285aa37b2fc326e64ffc3d9eef47130d</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Event</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Transfer</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Parameters</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <dl>
                        <dd>From: null</dd>
                        <dd>To: 0xB86E7b67ad427b2283849f846c17F29fA6f3af29</dd>
                        <dd>Value: 1000000000000000000</dd>
                      </dl>
                    </dd>

                  </div>

                </dl>
              </div>
            </div>
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Action</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Smart Contract Method Action</p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl class="sm:divide-y sm:divide-gray-200">
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Blockchain</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Matic Mainnet</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Contract Address</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">0x502f6e93285aa37b2fc326e64ffc3d9eef47130d</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Method</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">transfer</dd>
                  </div>
                  <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4  sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Parameters</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <dl>
                        <dd>To: 0xB86E7b67ad427b2283849f846c17F29fA6f3af29</dd>
                        <dd>Value: 1000000000000000000</dd>
                      </dl>
                    </dd>
                  </div>

                </dl>
              </div>
            </div>

          </div>
        </div>
      </div>

        <main class="-mt-32" id="app">
          <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div class="col-span-1 lg:col-span-2">
                <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                  <div class="bg-white py-5 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Engagements</h3>
                  </div>
                  <!-- This example requires Tailwind CSS v2.0+ -->
                  <div>
                    <div class="flow-root mt-6">
                      <ul role="list" class="-my-5 divide-y divide-gray-200">
                        <li v-for="engagement in engagements" class="py-4" :key="engagement.id">
                          <div class="flex items-center space-x-4">

                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 truncate">{{
                                  engagement.transaction_hash
                                }}</p>
                            </div>
                            <div>
                              <a :href="'https://polygonscan.com/tx/'+engagement.transaction_hash"
                                 target="_blank"
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

                  <div class="flex justify-between">
                    <button
                        v-if="!utility.selectedAccount"
                        @click="connectWallet" type="button"
                        class="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Connect Wallet
                    </button>
                    <span v-if="utility.selectedAccount && user.isValid"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"> Already on Whitelist </span>

                    <button
                        v-if="utility.selectedAccount && !user.maxEngagementsReached"
                        @click="triggerTransaction" type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Whitelist me
                    </button>
                  </div>
                  <div v-if="selectedAccount" class="overflow-scroll my-3" >
                    {{ selectedAccount }}
                  </div>
                </div>

                <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mt-5">
                  <div class="bg-white py-5 border-b border-gray-200">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Logs</h3>
                  </div>

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
