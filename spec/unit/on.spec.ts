import { subscribers } from "../../src/lib/constants";
import bus = require("../../src/");

describe("on", function () {
  it("should add subscriber to given event and origin", function () {
    const event = "event name";
    const origin = "https://example.com";
    const fn = jest.fn();

    bus.target(origin).on(event, fn);

    expect(subscribers[origin][event]).toEqual(expect.arrayContaining([fn]));
  });

  it("should add subscriber to given event and * origin if origin not given", function () {
    const event = "event name";
    const fn = jest.fn();

    bus.on(event, fn);

    expect(subscribers["*"][event]).toEqual(expect.arrayContaining([fn]));
  });
});