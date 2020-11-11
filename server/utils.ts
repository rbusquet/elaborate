import type * as FT from '@firebase/firestore-types'
import type * as Types from 'types'

type ArticleDocumentData = {
  author: FT.DocumentReference<{name: string}>
  createdDate: FT.Timestamp
} & Omit<Types.Article, 'id'>

async function getPosts(
  firestore: Types.FirebaseFirestore,
): Promise<Types.Article[]> {
  const snapshot = await firestore
    .collection<ArticleDocumentData>('posts')
    .get()
  const posts = await Promise.all(snapshot.docs.map(toArticle))
  return posts
}

async function toArticle(
  doc: FT.QueryDocumentSnapshot<ArticleDocumentData>,
): Promise<Types.Article> {
  const data = doc.data()
  const author = (await data.author.get()).data()?.name ?? 'Unknown'
  const createdDate = data.createdDate.toDate().getTime()
  const {title, content, category} = data
  return {id: doc.id, createdDate, author, title, content, category}
}

export {getPosts}