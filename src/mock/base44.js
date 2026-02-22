export const User = {
  me: async () => ({ id: "u1", email: "test@example.com", name: "Test User" }),
};

export const Property = {
  list: async () => [],
  filter: async () => [],
  create: async (data) => ({ id: crypto.randomUUID(), ...data }),
  update: async (id, data) => ({ id, ...data }),
};

export const Broker = {
  list: async () => [],
  filter: async () => [],
  create: async (data) => ({ id: crypto.randomUUID(), ...data }),
  update: async (id, data) => ({ id, ...data }),
};

export const ClientProfile = {
  filter: async () => [],
  create: async (data) => ({ id: crypto.randomUUID(), ...data }),
  update: async (id, data) => ({ id, ...data }),
};

export const Message = {
  filter: async () => [],
  create: async (data) => ({ id: crypto.randomUUID(), ...data }),
};

export const SupportTicket = {
  create: async (data) => ({ id: crypto.randomUUID(), ...data }),
};