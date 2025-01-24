

const compras = Vue.createApp({
  template: `
    <div id="contenido">
    <h1>Lista de Componentes</h1> 
        <label for="monedas">Moneda: </label> <!--Esta es una lista de opciones para elegir la divisa, que al elegir una divisa llama a la función cambiarValorMonetario()-->
        <select id="monedas" v-model="monedaElegida" @change="cambiarValorMonetario(monedaElegida)">
          <option value="EUR">Euros</option>
          <option value="USD">Dólares Estadounidenses</option>
          <option value="JPY">Yenes</option>
          <option value="MXN">Pesos Mexicanos</option>
        </select>
      <div id="flexbox">
        
        <div class="pc">
          <div v-for="pc in paginatedPCS" :key="pc.id" > <!--Muestra todos los productos en contenedores-->
            <img :src="pc.imagen" :alt="pc.componente" width="200" height="200" />
            <div>
              <strong>{{ pc.componente }}</strong> 
            </div>
            <div>
            <p>{{ pc.descripcion }}</p>
            </div>
            <div>
              {{ pc.precio_variable.toFixed(2).toLocaleString() }} {{ simbolos[monedaElegida] }}
            </div>
            <div>
              <button @click="pc.cant--" :disabled="pc.cant <= 1">-</button>
              <span>{{ pc.cant }}</span>
              <button @click="pc.cant++" :disabled="pc.cant >= 5">+</button>
              <button class='carrito' @click="anadirCarrito(pc.id, pc.cant), pc.cant = 0">Añadir al carrito</button> 
            </div>
            
          </div>
        </div>
        <div class=flexcarrito>
        <button @click="mostrarCarrito = !mostrarCarrito" class="mCarrito">Carrito</button>
          <div v-if="mostrarCarrito" class="barra_lateral">
            <div v-if="carrito.length > 0">
              <div v-for="(item, index) in carrito" class="itemCarrito"> <!--Uso cada diccionario del array del carrito de la compra para componer el carrito con sus productos-->
                <img :src="parts[item['id'] - 1].imagen" :alt="parts[item['id'] - 1].componente" width="50" height="50" />
                {{ item["nombre"] }} x{{ item["cantidad"] }} ---> {{ item["precio"] }} {{ simbolos[monedaElegida] }}
                <button @click="carrito.splice(index, 1)"><img src="img/bin.webp" width="24" height="24"></button> <!--Con esto elimino el item del carito-->
              </div>
            </div>
            <div v-else><strong>No hay ningún producto en el carrito</strong></div> <!--Si no hay ningun item en el carrito, te mostrará este mensaje-->
            <div class="sidebar-footer">Total: {{ precioTotal() }} {{ simbolos[monedaElegida] }}</div>
          </div>
        </div>
      </div>

      <div class="pagination"> <!--La paginación para las páginas de la tienda-->
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
    </div>


  `,
  data() {
    return {
      parts: [ // En este caso, he puesto tanto el precio base (en euros) como el precio que puede cambiar para tener como base el euro (al igual que en la api)
        { 
          id: 1,
          cant: 1,
          componente: "RTX 4090 24GB VRAM",
          precio_base: 1600,
          precio_variable: 1600,
          imagen: "img/RTX4090.webp",
          descripcion: "La tarjeta gráfica más potente del mercado"
        },
        { 
          id: 2,
          cant: 1,
          componente: "GTX 1660Ti 6GB VRAM",
          precio_base: 299,
          precio_variable: 299,
          imagen: "img/GTX1660TI.webp",
          descripcion: "Una tarjeta gráfica un poco más antigua pero que aún así funciona bién si vas a iniciar en el mundo del gaming"
        },        
        { 
          id: 3,
          cant: 1,
          componente: "2x8GB RAM 3200Hz",
          precio_base: 29.99,
          precio_variable: 29.99,
          imagen: "img/2x8RAM.jpg",
          descripcion: "2 sticks de RAM con un total de 16GB para obtener el mayor rendimiento"
        },
        { 
          id: 4,
          cant: 1,
          componente: "PSU CoolerMaster 750Watt 80 Plus Gold",
          precio_base: 90,
          precio_variable: 90,
          imagen: "img/PSU750WATT.webp",
          descripcion: "Unidad de supply de energía con suficiente potencia para servir a todos tus componentes"
        },
        { 
          id: 5,
          cant: 1,
          componente: "RX 6600XT 8GB VRAM",
          precio_base: 260,
          precio_variable: 260,
          divisa: "EUR",
          imagen: "img/RX6600XT.webp",
          descripcion: "Una tarjeta gráfica de gama media con una potencia considerable si lo que buscas es calidad precio"
        },
        { 
          id: 6,
          cant: 1,
          componente: "Gigabyte B550M DS3H V2 AM4",
          precio_base: 125,
          precio_variable: 125,
          imagen: "img/B550M.webp",
          descripcion: "La placa base de antigua generación mas usada y con compatibilidad para todos tus componentes"
        },
        { 
          id: 7,
          cant: 1,
          componente: "Kingston M.2 NVMe 2TB SSD",
          precio_base: 110,
          precio_variable: 110,
          imagen: "img/KINGSTON2TB.jpg",
          descripcion: "Una gran cantidad de espacio a una velocidad de ensueño por un precio un poco elevado"
        },
        { 
          id: 8,
          cant: 1,
          componente: "Crucial SATA SSD 4TB ",
          precio_base: 140,
          precio_variable: 140,
          imagen: "img/CRUCIAL4TB.webp",
          descripcion: "Muchísimo espacio y una buena velocidad a cambio de un precio bastante ajustado"
        },
        { 
          id: 9,
          cant: 1,
          componente: "AMD Ryzen 7 7800X3D 8 Core 16 Thread CPU",
          precio_base: 320,
          precio_variable: 320,
          imagen: "img/RYZEN77800X3D.webp",
          descripcion: "El mejor procesador de gama media/alta por parte de AMD con una buena potencia"
        },
        { 
          id: 10,
          cant: 1,
          componente: "Intel Core i9 14900K 12 Core 24 Thread CPU",
          precio_base: 700,
          precio_variable: 700,
          imagen: "img/INTELI914900K.webp",
          descripcion: "El mejor procesador de gama alta por parte de Intel con la mayor potencia"
        },
      ],
      carrito: [],
      mostrarCarrito: false,
      currentPage: 1,
      itemsPerPage: 4,
      items: 0,
      monedas: {},
      monedaElegida: "EUR",
      simbolos: { USD: "$", EUR: "€", MXN: "$", JPY: "¥" }
    }
  },
  computed: {
    totalPages() { // Paginación
      return Math.ceil(this.parts.length / this.itemsPerPage)
    },
    paginatedPCS() { // Paginación
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.parts.slice(start, end)
    },
  },
  methods: {
    nextPage() { // Paginación
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    prevPage() { // Paginación
      if (this.currentPage > 1) this.currentPage--
    },
    anadirCarrito(id, cant) { // Toda esta función añadirá items al carrito pero también comprobará si 
      let idExiste = false   // ese item estaba ya en el carrito
      let indexArray = 0
      for (let i in this.carrito) { // Recorre el carrito en busca de un id que coincida con el del producto nuevo
        if (this.carrito[i]["id"] == id) {
          idExiste = true // Si lo encuentra 
          indexArray = i
        }
      }
      if (!idExiste) { // Si no lo encuentra crea un nuevo diccionario en el array del carrito
        const innerDict = {}
        innerDict.id = id
        innerDict.cantidad = cant;
        innerDict.nombre = this.parts[id - 1].componente
        innerDict.precio = this.parts[id - 1].precio_variable * cant
        this.carrito.push(innerDict)
      }
      else { // Si lo encuentra, actualiza la cantidad de items y el precio total
        this.carrito[indexArray]["cantidad"] += cant
        this.carrito[indexArray]["precio"] = ((this.parts[id - 1].precio_variable * this.carrito[indexArray]["cantidad"])).toFixed(2)
      }
    },
    precioTotal() { // Función para mostrar el precio total en el desglose del carrito
      let total = 0;
      for (let item of this.carrito) {
        total += Number(item["precio"])
      }
      return total.toFixed(2)
    },
    async cargarMonedas() { // Carga la api y mete los datos en un diccionario
      const response = await fetch('https://v6.exchangerate-api.com/v6/099f68e19043d1eeeb27d43d/latest/EUR');
      const data = await response.json();
      this.monedas = Object(data.conversion_rates);
      console.log(this.monedas)
    },
    cambiarValorMonetario(moneda) { // Esto evalúa el tipo de moneda que tienes elegido y convierte 
      if (moneda === "EUR") {        // el precio base a el valor de la divisa
        for (item of this.parts) {
          item.precio_variable = Number(item.precio_base) // Si la moneda es la divisa base, el precio variable será el de base
        }
        for(item in this.carrito){ // Aplico lo mismo al carrito 
          this.carrito[item]["precio"] = (this.parts[this.carrito[item]["id"] - 1].precio_variable * this.carrito[item]["cantidad"])
        }
      }
      else {
        for (item of this.parts) {
          item.precio_variable = Number(item.precio_base) * Number(this.monedas[moneda]) // Si la moneda es otra divisa, el precio variable será el de base por el valor de la moneda con respecto al euro 
        }
        for(item in this.carrito){
          console.log("Index de la lista: " + item) // Aplico lo mismo al carrito 
          this.carrito[item]["precio"] = (this.parts[this.carrito[item]["id"] - 1].precio_variable * this.carrito[item]["cantidad"])
        }
      }
    }
  },
  beforeMount() { // Carga las monedas antes de cargar las páginas
    this.cargarMonedas()
  }
})
compras.mount('#app')
