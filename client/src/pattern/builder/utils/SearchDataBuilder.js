class SearchDataBuilder {
  constructor() {
    this.searchData = {};
  }

  setCity(city) {
    this.searchData.city = city;
    return this;
  }

  setDayStart(dayStart) {
    this.searchData.dayStart = dayStart;
    return this;
  }

  setDayEnd(dayEnd) {
    this.searchData.dayEnd = dayEnd;
    return this;
  }

  setPeople(people) {
    this.searchData.people = people;
    return this;
  }

  build() {
    return this.searchData;
  }
}

export default SearchDataBuilder;
