class KebabPlace {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.address = data.address;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.googleMapsUrl = data.google_maps_url;
    this.googleMapsRating = data.google_maps_rating;
    this.phone = data.phone;
    this.website = data.website;
    this.android = data.android;
    this.ios = data.ios;
    this.email = data.email;
    this.openedAtYear = data.opened_at_year;
    this.closedAtYear = data.closed_at_year;
    this.openingHours = data.opening_hours;
    this.fillings = data.fillings;
    this.sauces = data.sauces;
    this.status = data.status;
    this.isCraft = data.is_craft;
    this.isChainRestaurant = data.is_chain_restaurant;
    this.locationType = data.location_type;
    this.orderOptions = data.order_options;
    this.socialMedia = data.social_media;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  getCoordinates() {
    return {
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}

export default KebabPlace;

