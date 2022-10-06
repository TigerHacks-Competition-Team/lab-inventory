const { createClient } = supabase,
      _supabase = createClient('https://db.apdqcjlnovlnwziquaye.supabase.co', 'tigerhacks2022');

var currentFilterType = FilterType.location;
var items = [];
var locationWall = new LocationData("wall"),
    locationCorner = new LocationData("corner"),
    typePCB = new ItemTypeData("PCB"),
    typeWire = new ItemTypeData("Wire"),
    typeCase = new ItemTypeData("Case");

items.push(new ItemData("balls", 5, "in storage", locationWall, typePCB));
items.push(new ItemData("balls fart", 10, "in storage", locationCorner, typeWire));
items.push(new ItemData("balls dong", 15, "in storage", locationCorner, typeCase));
items.push(new ItemData("balls ball", 55, "in storage", locationWall, typePCB));

items.forEach(function(e, idx) {
    addItemToTable(items[idx].name, items[idx].quantity, items[idx].status);
})