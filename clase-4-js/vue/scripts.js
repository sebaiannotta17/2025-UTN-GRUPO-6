var app = new Vue({
  el: '#app',
  data: {
    message: 'Hola Vue!',
    counter: 0,
    input: '',
    currencies: null
  },
  methods: {
  	increment() {
  		this.counter++;
  	}
  },
  filters: {
  	currencyfixed(value) {
  		return value.toFixed(2);
  	}
  },
  mounted() {
  	axios.get('https://blockchain.info/ticker')
  		.then(response => (this.currencies = response.data));
  }
});