<template>
  <div id="app">
    <amplify-authenticator>
      <div v-if="user">
        <amplify-sign-out></amplify-sign-out>
        <chat-wrapper></chat-wrapper>
      </div>
    </amplify-authenticator>
  </div>
</template>

<script>
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { DataStore } from "@aws-amplify/datastore";
import { Chatty } from "./models";
import { Hub } from "aws-amplify";
import Vue from "vue";
import Toasted from "vue-toasted";
import { mapActions, mapMutations, mapGetters } from "vuex";
import ChatWrapper from "./components/ChatWrapper.vue";
Vue.use(Toasted);

export default {
  name: "app",
  components: {
    ChatWrapper,
  },
  data() {
    return {
      user: {},
      messages: [],
      form: {},
      loading: true,
      subscription: undefined,
      listener: undefined,
      offline: undefined,
    };
  },
  created() {
    //listen to datastore
    console.log("Registering datastore hub");
    this.listener = Hub.listen("datastore", (message) => {
      const { event, data } = message.payload;
      console.log("DataStore event", event, data);
      if (event === "networkStatus") {
        this.setNetwork(!data.active);
        if (this.statusOffline) {
          this.$toasted.show("You are offline. Your messages will be shared once you are connected.", {
            theme: "outline",
            position: "top-center",
            duration: 5000,
          });
        }
      }
    });

    //Subscribe to changes
    this.subscription = DataStore.observe(Chatty).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      this.loadMessages();
    });

    // authentication state managament
    onAuthUIStateChange((state, user) => {
      switch (state) {
        case AuthState.SignedIn: {
          //console.log("User signed in");
          this.setUser(user);
          this.loadMessages();
          return;
        }
        case AuthState.SignedOut: {
          //console.log("User signed out");
          this.removeUser();
          return;
        }
        default: {
          //console.log(`Event: ${event}`);
        }
      }
    });
  },
  computed: {
    ...mapGetters(["statusOffline"])
  },
  destroyed() {
    if (!this.subscription) return;
    this.subscription.unsubscribe();
    this.listener();
  },
  methods: {
    ...mapMutations({
      setUser: "SET_USER",
      removeUser: "REMOVE_USER",
      setNetwork: "SET_OFFLINE",
    }),
    ...mapActions(["loadMessages"]),
  },
};
</script>

<style>
:root {
  /* Colors */
  --amplify-primary-color: #efa985;
  --amplify-primary-tint: #ee9929;
  --amplify-primary-shade: #ee9929;
}
</style>