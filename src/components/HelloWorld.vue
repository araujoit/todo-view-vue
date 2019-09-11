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
    <div>
      <b-button v-b-modal.add-item>Adicionar item</b-button>

      <b-modal id="add-item" title="Adicionando item" hide-footer>
        <b-form @submit="onSubmitItem" @reset="onResetItem" v-if="showItemform">
          <b-form-group
            id="input-group-1"
            label="Lembrete"
            label-for="lembrete-input"
            description="Adicione um lembrete útil, por favor..."
          >
            <b-form-input
              id="lembrete-input"
              v-model="form.lembrete"
              type="text"
              required
              placeholder="Entre com um lembrete"
            ></b-form-input>
          </b-form-group>
          
          <b-button type="submit" variant="primary">Enviar</b-button>
          <b-button type="reset" variant="danger">Resetar</b-button>
        </b-form>
        <b-card class="mt-3" header="Form Data Result">
          <pre class="m-0">{{ form }}</pre>
        </b-card>

        <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Fechar</b-button>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BootstrapVue, { VBModal, BModal } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const endpoint = 'http://127.0.0.1:3000'

Vue.use(BootstrapVue)

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
  },
  components: {
    'b-modal': BModal
  },
  directives: {
    'b-modal': VBModal
  }
})

export default {
  name: 'HelloWorld',
  data () {
    return {
      todoList: globalTodoList,
      componentKey: 0,
      form: {
        lembrete: ''
      },
      showItemform: true
    }
  },
  methods: {
    onSubmitItem (evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.form))
    },
    onResetItem (evt) {
      evt.preventDefault()

      this.form.lembrete = ''
      this.showItemform = false
      this.$nextTick(() => {
        this.showItemform = true
      })
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
