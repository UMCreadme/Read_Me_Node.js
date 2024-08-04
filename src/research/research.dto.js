export class RecentSearchesDTO {
    constructor({ query, recent_searches_id, book_id, bookImg, title, author}) {
        this.query = query;
        this.recent_searches_id = recent_searches_id;
        if (book_id) {
            this.book_id = book_id;
            this.bookImg = bookImg;
            this.title = title;
            this.author = author;
        }
    }
}