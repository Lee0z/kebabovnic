class Comment {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.userId = data.user_id;
    this.kebabPlaceId = data.kebab_place_id;
    this.parentId = data.parent_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.isOwner = data.is_owner;
    this.userName = data.user_name;
  }
}

export default Comment;
