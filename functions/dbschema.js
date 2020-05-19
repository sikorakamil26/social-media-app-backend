//this file is just for reference, so you know how database looks like

let db = {
    users: [
        {
            userId: 'qwegqwrqwegqwefqwe',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-03-14T10:59:52.798Z',
            imageUrl: 'image/qwefqwevqwervqw/qwegwqegwq',
            bio: 'Hello my name is Kamil I like sth', //extra / optional
            website: 'https://user.com', //extra
            loaction: 'London, UK' //exttra / optional
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2020-05-18T17:20:56.361Z',
            likeCount: 5,
            commandCount: 2
        }
    ]
}