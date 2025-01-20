export default class SuggestionModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.user_id = data.user_id;
    this.kebab_place_id = data.kebab_place_id;
    this.comment = data.comment;
    this.created_at = new Date(data.created_at);
    this.updated_at = new Date(data.updated_at);
  }

  static fromApiResponse(data) {
    return data.map(item => new SuggestionModel(item));
  }
}

