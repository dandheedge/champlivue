<template>
  <div class="flex-1 my-4">
    <div class="max-w-3xl mx-auto">
      <div class="flex flex-row pl-6 md:pl-0 border-b border-gray-400">
        <h6
          class="text-2xl text-white leading-9 tracking-tight sm:leading-10 pb-3 w-4/5"
        >
          {{ getUser.username }}
        </h6>
      </div>
      <div
        class="bg-primarylight rounded-lg relative py-4 px-4 sm:px-4 lg:px-6"
      >
        <div class="flex flex-col w-full">
          <div
            class="mt-4 mb-6 sm:mt-4"
            v-for="message in sorted"
            :key="message.id"
            v-bind:class="[getUser.username === message.user ? 'ml-auto' : '']"
          >
            <h4 class="text-red-500 text-bold mb-4 px-4 text-lg capitalize">
              {{ message.user }}
              <span class="ml-4 text-xs text-opacity-50 text-white">{{
                message.createdAt | formatTime
              }}</span>
            </h4>
            <p
              v-bind:class="[
                getUser.username === message.user
                  ? 'bg-secondary'
                  : 'bg-primarydark',
              ]"
              class="inline y p-4 rounded-full text-gray-300 sm:text-sm lg:text-base"
              :title="$options.filters.formatDateTime(message.createdAt)"
            >
              {{ message.message }}
            </p>
          </div>
        </div>
        <form v-on:submit.prevent="sendMessage" class="w-full mt-4" v-if="getUser.username">
          <div
            class="flex flex-col lg:flex-row lg:content-center items-center lg:border-b lg:border-teal-500 py-2"
          >
            <input
              class="appearance-none bg-white border-none w-full text-gray-700 lg:mr-3 py-4 lg:py-4 px-2 leading-tight focus:outline-none"
              type="text"
              v-model="form.message"
              placeholder="Please Enter your message..."
              aria-label="Chat Message"
              :class="{ 'border-red-500': statusOffline }"
            />
            <button
              class="lg:flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded w-full lg:w-auto mt-2 lg:mt-0"
              type="button"
              @click="sendMessage"
            >
              Send Message
            </button>
            <button
              class="lg:flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded w-full lg:w-auto"
              type="button"
              @click="deleteAll"
            >
              Delete All Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { mapActions, mapGetters } from "vuex";
import Vue from "vue";
import moment from "moment";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Chatty } from "@/models";

Vue.filter("formatTime", function (value) {
  if (value) {
    return moment(String(value)).format("Do MMMM YYYY, HH:mm:ss");
  }
});
Vue.filter("formatDateTime", function (value) {
  if (value) {
    return moment(String(value)).format("YYYY-MM-DD HH:mm:ss");
  }
});
export default {
  name: "ChatWrapper",
  data() {
    return {
      form: {},
    };
  },
  methods: {
    moment: () => moment(),
    ...mapActions(["loadMessages"]),
    sendMessage() {
      const { message } = this.form;
      if (!message) return;
      DataStore.save(
        new Chatty({
          user: this.getUser.username,
          message: message,
          createdAt: new Date().toISOString(),
        })
      )
        .then(() => {
          console.log("message created!");
          this.form = { message: "" };
          this.loadMessages();
        })
        .catch((e) => {
          console.log("error creating message...", e);
        });
    },
    async deleteAll() {
      await DataStore.delete(Chatty, Predicates.ALL)
        .then(() => this.loadMessages())
        .catch((e) => {
          console.log("error deleting all messages...", e);
        });
    },
  },
  computed: {
    ...mapGetters(["getMessages", "getUser","statusOffline"]),
    sorted() {
      let messages = [...this.getMessages];
      return messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
  },
  created() {
    this.loadMessages();
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
};
</script>