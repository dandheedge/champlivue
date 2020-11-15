import Vue from "vue";
import App from "./App.vue";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import aws_exports from "./aws-exports";
import "./registerServiceWorker";
import { store } from "./store";
import "@/assets/style/tailwind.css";
Amplify.configure(aws_exports);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store: store,
}).$mount("#app");
