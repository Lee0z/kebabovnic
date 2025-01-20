class Filling {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.isVege = data.is_vege;
    this.hexColor = data.hex_color;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}

export default Filling;
