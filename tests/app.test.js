const request = require('supertest');
const expect = require('expect');

const app = require('../app');
let testId = "";

describe('POST /hotel', () => {
    it('Positive Case Should Return "SUCCESS"', (done) => {
        request(app)
        .post('/hotel')
        .send({"hotel_name": "testHotel", "rooms": []})
        .expect(200)
        .expect((res)=>{
            testId = res.body.data._id.toString();
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
            expect(res.body.data.hotel_name).toBe("testHotel");
        })
        .end(done);
    });


    it('Negative Case Should Return "Error"', (done) => {
        request(app)
        .post('/hotel')
        .send({"rooms": []})
        .expect(400)
        .expect((res)=>{
            expect(res.body.status).toBe("FAIL");
            expect(res.body.statusCode).toBe(400);
        })
        .end(done);
    });
});

describe('GET /hotel', () => {
    it('Success Case Should Return all hotels', (done) => {
        request(app)
        .get('/hotel')
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
            expect(!!res.body.data.length).toBe(true);
        })
        .end(done);
    });

    it('Success Case With Filters Should Return filtered hotels', (done) => {
        request(app)
        .get('/hotel?filter={"_id":"' + testId + '"}')
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0]._id.toString()).toBe(testId);
        })
        .end(done);
    });

    it('Fail Case Should Return Error', (done) => {
        request(app)
        .get('/hotel?filter=""')
        .expect(400)
        .expect((res)=>{
            expect(res.body.status).toBe("FAIL");
            expect(res.body.statusCode).toBe(400);
        })
        .end(done);
    });

    it('GetById Case Should Return Success', (done) => {
        request(app)
        .get('/hotel/' + testId)
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
            expect(res.body.data._id.toString()).toBe(testId);
        })
        .end(done);
    });

    it('Invalid_Id Case Should Return Error', (done) => {
        request(app)
        .get('/hotel/invaid_id')
        .expect(400)
        .expect((res)=>{
            expect(res.body.status).toBe("FAIL");
            expect(res.body.statusCode).toBe(400);
        })
        .end(done);
    });
});

describe('PUT /hotel/:id', () => {
    it('Positive Update Case Should Return "SUCCESS"', (done) => {
        request(app)
        .put('/hotel/' + testId)
        .send({"hotel_name": "updated_name"})
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
        })
        .end(done);
    });
});

describe('POST /hotel/room/:id', () => {
    it('Positive Add Room Case Should Return "SUCCESS"', (done) => {
        request(app)
        .post('/hotel/room/' + testId)
        .send({"room_number": "testRoom01"})
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
            })
        .end(done);
    });
});

describe('DELETE /hotel/:id', () => {
    it('Positive Delete Case Should Return "Error"', (done) => {
        request(app)
        .del('/hotel/' + testId)
        .expect(200)
        .expect((res)=>{
            expect(res.body.status).toBe("SUCCESS");
            expect(res.body.statusCode).toBe(200);
        })
        .end(done);
    });
});

