// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

var globalTodoList = []

var removerItem = function (_id) {
  if (confirm('Deseja remover a task ' + _id + '?')) {
    /**
     * Busca tasks na API, adicionando à lista
     */
    axios
      .delete('http://127.0.0.1:3000/tasks/' + _id)
      .then(response => response.status === 200)
      .then(() => {
        var index = globalTodoList.map(item => item.id).indexOf(_id)
        globalTodoList.splice(index, 1) // remove o item, 1 vez
      }, () => alert('Falha ao tentar remover a task!'))
  }
}

/**
 * Registra um novo componente de item
 */
Vue.component('todo-item', {
  props: ['todo'],
  template: `
    <li>
      <div class="todo-item" v-on:click="deleteTodoItem(todo.id)">
        <h3>{{ todo.createdDate }}</h3>
        <div v-html="todo.text"></div>
      </div>
    </li>
  `,
  methods: {
    deleteTodoItem: removerItem
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
