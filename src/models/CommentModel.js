export default class CommentModel {
  constructor(data) {
    this.id = data.id;
    this.userName = data.user_name; // Ensure this matches the API response
    this.content = data.content;
    this.userId = data.user_id; // Ensure this matches the API response
    this.createdAt = new Date(data.created_at); // Ensure this matches the API response
    this.updatedAt = new Date(data.updated_at); // Ensure this matches the API response
  }

  static fromApiResponse(data) {
    return data.map(item => new CommentModel(item));
  }
}
