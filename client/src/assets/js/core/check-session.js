const storage = window.localStorage

// Function to store an item with an expiration time
const setWithExpiration = (key, value, expirationMinutes) => {
	const now = new Date()
	const item = {
		value,
		expiration: now.getTime() + expirationMinutes * 60 * 1000,
	}
	storage.setItem(key, JSON.stringify(item))
}
const getWithExpiration = (key) => {
	const item = JSON.parse(storage.getItem(key))
	if (!item) {
		return null
	}
	const now = new Date().getTime()
	if (now > item?.expiration) {
		// Item has expired, remove it and return null
		storage.removeItem(key)
		return null
	}
	return item.value
}

const removeExpiredItems = () => {
	for (let i = 0; i < storage.length; i++) {
		const key = storage.key(i)
        if(key != 'undefined'){
            const item =  JSON.parse(storage.getItem(key))
            if (item && new Date().getTime() > item.expiration) {
                storage.removeItem(key)
            }

        }
	}

}

// setInterval(removeExpiredItems, 5000)
