const FilterType = {
    location: 'Location',
    itemType: 'Type'
}

function ItemData(name, quantity, status, location, type) {
    this.name = name,
    this.quantity = quantity,
    this.status = status,
    this.location = location,
    this.type = type;
}

function LocationData(name) {
    this.name = name;
}

function ItemTypeData(name) {
    this.name = name;
}