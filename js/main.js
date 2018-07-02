class Carousel {
	/**
	*@param 
	*
	*/

	constructor (element,options = {}){
		this.element = element
		this.options = Object.assign({},{
			slidesToScroll:1,
			slidesVisible:1,
			loop: false
		},options)

		let children = [].slice.call(element.children)
		this.isMobile = false
		this.currentItem = 0

		//Modifiation du DOM
		this.root = this.createDivWithClass('carousel')
		this.container = this.createDivWithClass('carousel__container')
		this.root.setAttribute('tabindex','0')
		this.root.appendChild(this.container)
		this.element.appendChild(this.root)
		this.moveCallbacks = []
		this.items = children.map((child) => {
			let item = this.createDivWithClass('carousel__item')
			item.appendChild(child)
          	this.container.appendChild(item)
          	return item
		})
		this.setStyle()
		this.CreateNavigation()

		//Evenements
		this.moveCallbacks.forEach(cb => cb(0))
		this.onWindowResize()
		window.addEventListener('resize',this.onWindowResize.bind(this))
		this.root.addEventListener('keyup',e => {
			if (e.key === 'ArrowRight' || e.key === 'Right' ) {
				this.next()
			}else if(e.key === 'ArrowLeft' || e.key === 'Left'){
				this.prev()
			}
		})

	}

	/**
	* Permet d'appliquer lse bonnes dimensions aux elements du carousel
	*/
	setStyle() {
		let ratio = this.items.length / this.slidesVisible
		this.container.style.width = (ratio * 100 ) + "%"
		this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
	}

	CreateNavigation() {
		let nextButton = this.createDivWithClass('carousel__next')
		let prevButton = this.createDivWithClass('carousel__prev')
		this.root.appendChild(nextButton)
		this.root.appendChild(prevButton)
		nextButton.addEventListener('click',this.next.bind(this))
		prevButton.addEventListener('click',this.prev.bind(this))
		if (this.options.loop === true) {
			return false;
		}
		this.onItemMove(index => {
			if (index === 0) {
				prevButton.classList.add('carousel__prev--hidden')
			} else {
				prevButton.classList.remove('carousel__prev--hidden')
			}

			if (this.items[this.currentItem + this.options.slidesVisible] === undefined) {
				nextButton.classList.add('carousel__next--hidden')
			} else {
				nextButton.classList.remove('carousel__next--hidden')
			}
		})
	}

	next() {

		this.gotoItem(this.currentItem + this.slidesToScroll)
	}

	prev () {
		
		this.gotoItem(this.currentItem - this.slidesToScroll)
	}


	gotoItem(index) {
		if (index < 0) {
			if(this.options.loop){
				index = this.items.length - this.slidesVisible 	
			}else{
				return false;
			}

		}else if(index >= this.items.length || (this.items[this.currentItem + this.options.slidesVisible] === undefined && index > this.currentItem)){
			index = 0
		}
		let translateX = index * -100 / this.items.length
		this.container.style.transform = 'translate3d('+ translateX +'%,0,0)'
		this.currentItem = index
		this.moveCallbacks.forEach(cb => cb(index))
	}

	onItemMove(cb) {

		this.moveCallbacks.push(cb)
	}

	onWindowResize() {

		let mobile = window.innerWidth < 800
		if(mobile !== this.isMobile){
			this.isMobile = mobile
			this.setStyle()
			this.moveCallbacks.forEach(cb => cb(this.currentItem))
		}
	}

	createDivWithClass(className){
		let div = document.createElement('div')
		div.setAttribute('class', className)
		return div
	}

	get slidesToScroll(){

		return this.isMobile ? 1 : this.options.slidesToScroll
	}

	get slidesVisible(){

		return this.isMobile ? 1 : this.options.slidesVisible
	}


}

// document.addEventListener("DOMContentLoaded", function(event) {
//     console.log("DOM fully loaded and parsed");
// 	alert("samba")
//   });
   new Carousel(document.querySelector('#carousel1'),{
   	 slidesToScroll:1,
   	 slidesVisible:3,
   	 loop: false
   })


