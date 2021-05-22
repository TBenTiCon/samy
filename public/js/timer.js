class Timer {
	constructor(timeObj, id) {
		const currentTime = new Date().getHours() * 60 + new Date().getMinutes();

		var time = timeObj - currentTime;

		var newTime = convertToTime(time).split('.');

		this.hour = newTime[0];
		this.minute = newTime[1];

		if (this.minute < 0) {
			this.minute = 0;
		}
		if (this.hour < 0) {
			this.hour = 0;
		}

		this.second = new Date().getSeconds();

		this.id = id;

		this.RenderTime();
		this.countDownInt;

		console.log('Timer Created');
	}

	async countDown() {
		this.countDownInt = await setInterval(() => {
			if (this.minute === 0 && this.hour === 0 && this.second === 0) {
				clearInterval(countDownInt);
			}

			if (this.second > 0) {
				this.second--;
			}

			if (this.second === 0 && this.minute > 0) {
				this.minute--;
				this.second = 60;
			}

			if (this.minute <= 0 && this.hour > 0) {
				this.hour--;
				this.minute = 60;
			}

			//draw

			this.RenderTime();
		}, 1000);
	}

	stopInterval() {
		clearInterval(this.countDownInt);
	}

	async RenderTime() {
		if (this.hour < 10) {
			document.querySelector(`#I${this.id} .timermin`).textContent = '0' + this.hour;
		} else {
			document.querySelector(`#I${this.id} .timermin`).textContent = this.hour;
		}

		if (this.minute < 10) {
			document.querySelector(`#I${this.id} .timersec`).textContent = '0' + this.minute;
		} else {
			document.querySelector(`#I${this.id} .timersec`).textContent = this.minute;
		}

		if (this.second < 10) {
			document.querySelector(`#I${this.id} .timerSeconds`).textContent = '0' + this.second;
		} else {
			document.querySelector(`#I${this.id} .timerSeconds`).textContent = this.second;
		}
	}
}
