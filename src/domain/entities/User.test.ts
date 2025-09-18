import { UserEntity } from "./User";

describe("UserEntity", () => {
  describe("getAccountAge()", () => {
    it("should calculate account age in days", () => {
      const createdTime = Date.now() / 1000 - 86400 * 30; // 30 days ago
      const user = new UserEntity("testuser", createdTime, 100);

      expect(user.getAccountAge()).toBe(30);
    });

    it("should return 0 for new accounts", () => {
      const createdTime = Date.now() / 1000; // now
      const user = new UserEntity("testuser", createdTime, 100);

      expect(user.getAccountAge()).toBe(0);
    });

    it("should handle accounts created in the future", () => {
      const createdTime = Date.now() / 1000 + 86400; // tomorrow
      const user = new UserEntity("testuser", createdTime, 100);

      expect(user.getAccountAge()).toBe(0); // Should not be negative
    });

    it("should calculate fractional days correctly", () => {
      const createdTime = Date.now() / 1000 - 86400 * 30.7; // 30.7 days ago
      const user = new UserEntity("testuser", createdTime, 100);

      expect(user.getAccountAge()).toBe(30); // Should floor to 30
    });
  });

  describe("getCreatedDate()", () => {
    it("should format creation date as a valid date string", () => {
      // Create a specific date: January 15, 2023
      const createdTime = new Date("2023-01-15T00:00:00Z").getTime() / 1000;
      const user = new UserEntity("testuser", createdTime, 100);

      const result = user.getCreatedDate();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      // Should be a valid date string that can be parsed
      expect(isNaN(Date.parse(result))).toBe(false);
    });

    it("should format different dates consistently", () => {
      // Create a specific date: December 31, 2022
      const createdTime = new Date("2022-12-31T00:00:00Z").getTime() / 1000;
      const user = new UserEntity("testuser", createdTime, 100);

      const result = user.getCreatedDate();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      // Should be a valid date string that can be parsed
      expect(isNaN(Date.parse(result))).toBe(false);
    });
  });

  describe("hasSubmissions()", () => {
    it("should return false for users without submissions", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, 100);

      expect(user.hasSubmissions()).toBe(false);
    });

    it("should return false for users with empty submissions array", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        []
      );

      expect(user.hasSubmissions()).toBe(false);
    });

    it("should return true for users with submissions", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        [1, 2, 3]
      );

      expect(user.hasSubmissions()).toBe(true);
    });

    it("should return true for users with one submission", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        [1]
      );

      expect(user.hasSubmissions()).toBe(true);
    });
  });

  describe("getSubmissionCount()", () => {
    it("should return 0 for users without submissions", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, 100);

      expect(user.getSubmissionCount()).toBe(0);
    });

    it("should return 0 for users with empty submissions array", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        []
      );

      expect(user.getSubmissionCount()).toBe(0);
    });

    it("should return correct count for users with submissions", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        [1, 2, 3, 4, 5]
      );

      expect(user.getSubmissionCount()).toBe(5);
    });

    it("should return 1 for users with one submission", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined,
        [42]
      );

      expect(user.getSubmissionCount()).toBe(1);
    });
  });

  describe("hasAbout()", () => {
    it("should return false for users without about", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, 100);

      expect(user.hasAbout()).toBe(false);
    });

    it("should return false for users with undefined about", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        undefined
      );

      expect(user.hasAbout()).toBe(false);
    });

    it("should return false for users with null about", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        null as any
      );

      expect(user.hasAbout()).toBe(false);
    });

    it("should return false for users with empty about", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        ""
      );

      expect(user.hasAbout()).toBe(false);
    });

    it("should return false for users with whitespace-only about", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        "   "
      );

      expect(user.hasAbout()).toBe(false);
    });

    it("should return true for users with valid about", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        "I am a developer"
      );

      expect(user.hasAbout()).toBe(true);
    });

    it("should return true for users with about containing only non-whitespace", () => {
      const user = new UserEntity(
        "testuser",
        Date.now() / 1000,
        100,
        undefined,
        "x"
      );

      expect(user.hasAbout()).toBe(true);
    });
  });

  describe("constructor and properties", () => {
    it("should create user with all required properties", () => {
      const created = Date.now() / 1000;
      const user = new UserEntity("testuser", created, 150);

      expect(user.id).toBe("testuser");
      expect(user.created).toBe(created);
      expect(user.karma).toBe(150);
    });

    it("should create user with all optional properties", () => {
      const created = Date.now() / 1000;
      const user = new UserEntity(
        "testuser",
        created,
        150,
        5,
        "About me",
        [1, 2, 3]
      );

      expect(user.id).toBe("testuser");
      expect(user.created).toBe(created);
      expect(user.karma).toBe(150);
      expect(user.delay).toBe(5);
      expect(user.about).toBe("About me");
      expect(user.submitted).toEqual([1, 2, 3]);
    });

    it("should handle optional properties as undefined", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, 100);

      expect(user.delay).toBeUndefined();
      expect(user.about).toBeUndefined();
      expect(user.submitted).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle zero karma", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, 0);

      expect(user.karma).toBe(0);
    });

    it("should handle negative karma", () => {
      const user = new UserEntity("testuser", Date.now() / 1000, -5);

      expect(user.karma).toBe(-5);
    });

    it("should handle very old accounts", () => {
      const veryOldTime = Date.now() / 1000 - 86400 * 365 * 10; // 10 years ago
      const user = new UserEntity("testuser", veryOldTime, 100);

      expect(user.getAccountAge()).toBeGreaterThanOrEqual(3650); // At least 10 years
    });
  });
});
