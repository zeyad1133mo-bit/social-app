import {Post} from '../models/post.model';
import {IPost} from '../models/post.model';
import {AbstractRepository} from '../../../lib/db/abstract.repository';


class PostRepository extends AbstractRepository<IPost> {

constructor() {
    super(Post);
}

    async findByUserId(userId: string){
        return Post.find({ userId: userId });
    }


}

export default new PostRepository();
