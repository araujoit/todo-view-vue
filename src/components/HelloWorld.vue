<template>
  <div class="hello">
    <h2>TODO LIST</h2>
    <ul>
      <todo-item
        v-for="item in todoList"
        v-bind:todo="item"
        v-bind:key="item.id"
        v-bind:createdDate="item.createdDate"
      ></todo-item>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
const endpoint = 'http://127.0.0.1:3000'

var globalTodoList = []

let removerItem = function (_id) {
  if (confirm('Deseja remover a task ' + _id + '?')) {
    /**
     * Busca tasks na API, adicionando à lista
     */
    axios
      .delete(endpoint + '/tasks/' + _id)
      .then(response => response.status === 200)
      .then(() => {
        var index = globalTodoList.map(item => item.id).indexOf(_id)
        console.log('index: ' + index)
        if (index > -1) {
          globalTodoList.splice(index, 1) // remove o item, 1 vez
        }
      }, () => console.log('Falha no processo de remoção'))
  }
}

/**
 * Formata data, caso exista
 */
let toLocaleString = function (dateTime) {
  if (dateTime) {
    return new Date(dateTime).toLocaleString()
  }
  return ''
}

let fetchAllTasks = function () {
  // return [{ 'id': '123', 'createdDate': new Date().toLocaleString() }]
  axios
    .get(endpoint + '/tasks/')
    .then(response => {
      let jsonlist = []
      if (response.status === 200) {
        let item = {}
        for (item in response.data) {
          jsonlist.push({
            id: response.data[item]._id,
            text: response.data[item].name,
            createdDate: toLocaleString(response.data[item].Created_date)
          })
        }
      } else console.error(response.data)
      return jsonlist
    }, () => console.log('erro'))
    .then(jsonlist => {
      console.log('adicionando ' + jsonlist.length + ' itens encontrados às ' + new Date().toLocaleString())
      globalTodoList.push(...jsonlist)
    })
  return []
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

export default {
  name: 'HelloWorld',
  data () {
    return {
      todoList: globalTodoList,
      componentKey: 0
    }
  }
}
globalTodoList = fetchAllTasks()
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}
li:hover {
  color: blue;
}
a {
  color: #42b983;
}
</style>
