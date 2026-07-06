/**
 * Unit tests for projectController.js
 *
 * Strategy: mock the Project model and Express req/res/next objects.
 * We do NOT perform real DB calls or touch reports (soft-delete is the correct approach).
 */

'use strict';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../models/Project');
const Project = require('../models/Project');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const { deleteProject, createProject, updateProject } = require('../controllers/projectController');

/** Minimal Express mock helpers */
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// ─── deleteProject ────────────────────────────────────────────────────────────

describe('projectController.deleteProject', () => {
  afterEach(() => jest.clearAllMocks());

  it('sets isActive=false and saves (soft-delete) — does NOT touch reports', async () => {
    const fakeProject = {
      _id: 'proj789',
      name: 'Test Project',
      isActive: true,
      save: jest.fn().mockResolvedValue(true),
    };

    Project.findById.mockResolvedValue(fakeProject);

    const req = { params: { id: 'proj789' } };
    const res = mockRes();

    await deleteProject(req, res, mockNext);

    // Must set isActive to false
    expect(fakeProject.isActive).toBe(false);
    expect(fakeProject.save).toHaveBeenCalledTimes(1);

    // Must NOT call next with an error
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('calls next with AppError when project is not found', async () => {
    Project.findById.mockResolvedValue(null);

    const req = { params: { id: 'nonexistent' } };
    const res = mockRes();

    await deleteProject(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});

// ─── createProject ────────────────────────────────────────────────────────────

describe('projectController.createProject', () => {
  afterEach(() => jest.clearAllMocks());

  it('creates a project and returns 201', async () => {
    const fakeProject = { _id: 'proj001', name: 'Sprint Alpha', description: 'Q1 work' };
    Project.create.mockResolvedValue(fakeProject);

    const req = { body: { name: 'Sprint Alpha', description: 'Q1 work' } };
    const res = mockRes();

    await createProject(req, res, mockNext);

    expect(Project.create).toHaveBeenCalledWith({ name: 'Sprint Alpha', description: 'Q1 work' });
    // sendResponse calls res.status(201).json(...)
    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

// ─── updateProject ────────────────────────────────────────────────────────────

describe('projectController.updateProject', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls next with 404 when the project does not exist', async () => {
    Project.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'ghost' }, body: { name: 'Ghost' } };
    const res = mockRes();

    await updateProject(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
  });

  it('returns the updated project on success', async () => {
    const updated = { _id: 'proj789', name: 'Renamed Project' };
    Project.findByIdAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: 'proj789' }, body: { name: 'Renamed Project' } };
    const res = mockRes();

    await updateProject(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
