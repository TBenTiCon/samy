class Timer {
	constructor(h, min, elHour, elMin, elSec) {
		this.d = new Date();
		this.currentHour = this.d.getHours();
		this.currentMinute = this.d.getMinutes();

		this.hour = h - this.currentHour;
		this.minute = min - this.currentMinute;

		if (this.minute < 0) {
			this.minute = 0;
		}
		if (this.hour < 0) {
			this.hour = 0;
		}

		this.minute = 0;
		this.second = this.d.getSeconds();
		this.elementHour = elHour;
		this.elementMin = elMin;
		this.elementSec = elSec;
	}

	async countDown() {
		const countDownInt = await setInterval(() => {
			if (this.minute === 0 && this.hour === 0 && this.second === 0) {
				clearInterval(countDownInt);
				console.log('canceling timer');
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

			if (this.hour < 10) {
				this.elementHour.textContent = '0' + this.hour;
			} else {
				this.elementHour.textContent = this.hour;
			}

			if (this.minute < 10) {
				this.elementMin.textContent = '0' + this.minute;
			} else {
				this.elementMin.textContent = this.minute;
			}

			if (this.second < 10) {
				this.elementSec.textContent = '0' + this.second;
			} else {
				this.elementSec.textContent = this.second;
			}
		}, 1000);
	}
}
