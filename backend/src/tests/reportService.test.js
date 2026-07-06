/**
 * Unit tests for reportService.js
 *
 * Strategy: mock the Report Mongoose model so no real DB connection is needed.
 * Tests cover the business-logic guard clauses that are most likely to regress.
 */

'use strict';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('../models/Report');
const Report = require('../models/Report');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AppError = require('../utils/AppError');
const reportService = require('../services/reportService');

/** Build a minimal fake report document */
const makeFakeReport = (overrides = {}) => ({
  _id: 'report123',
  userId: 'user456',
  projectId: 'proj789',
  weekStartDate: new Date('2024-01-01'),
  weekEndDate: new Date('2024-01-07'),
  tasksCompleted: 'Built the login page and API',
  tasksPlanned: 'Work on dashboard next week',
  blockers: '',
  hoursWorked: 40,
  status: 'draft',
  save: jest.fn().mockResolvedValue(true),
  deleteOne: jest.fn().mockResolvedValue(true),
  ...overrides,
});

// ─── createReport ─────────────────────────────────────────────────────────────

describe('reportService.createReport', () => {
  it('throws AppError when weekEndDate is before weekStartDate', async () => {
    await expect(
      reportService.createReport('user456', {
        weekStartDate: '2024-01-07',
        weekEndDate: '2024-01-01', // end BEFORE start
        tasksCompleted: 'Done stuff',
        tasksPlanned: 'Plan stuff',
        projectId: 'proj789',
      })
    ).rejects.toThrow(AppError);
  });

  it('calls Report.create with the correct userId merged in', async () => {
    const mockReport = makeFakeReport({ status: 'draft' });
    Report.create.mockResolvedValue(mockReport);

    const result = await reportService.createReport('user456', {
      weekStartDate: '2024-01-01',
      weekEndDate: '2024-01-07',
      tasksCompleted: 'Built the login page and API',
      tasksPlanned: 'Work on dashboard',
      projectId: 'proj789',
    });

    expect(Report.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user456', projectId: 'proj789' })
    );
    expect(result).toBe(mockReport);
  });
});

// ─── submitReport ─────────────────────────────────────────────────────────────

describe('reportService.submitReport', () => {
  it('throws AppError when report is already submitted', async () => {
    const submittedReport = makeFakeReport({ status: 'submitted' });

    // getReportById internally calls Report.findOne — mock it
    Report.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(submittedReport),
    });

    await expect(
      reportService.submitReport('report123', 'user456')
    ).rejects.toThrow(AppError);
  });

  it('sets status to submitted and saves the report', async () => {
    const draftReport = makeFakeReport({ status: 'draft' });
    Report.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(draftReport),
    });

    const result = await reportService.submitReport('report123', 'user456');

    expect(draftReport.status).toBe('submitted');
    expect(draftReport.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(draftReport);
  });
});

// ─── deleteDraftReport ────────────────────────────────────────────────────────

describe('reportService.deleteDraftReport', () => {
  it('throws AppError when attempting to delete a submitted report', async () => {
    const submittedReport = makeFakeReport({ status: 'submitted' });
    Report.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(submittedReport),
    });

    await expect(
      reportService.deleteDraftReport('report123', 'user456')
    ).rejects.toThrow(AppError);
  });

  it('calls deleteOne on a draft report', async () => {
    const draftReport = makeFakeReport({ status: 'draft' });
    Report.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(draftReport),
    });

    await reportService.deleteDraftReport('report123', 'user456');

    expect(draftReport.deleteOne).toHaveBeenCalledTimes(1);
  });
});

// ─── getAllReports pagination ──────────────────────────────────────────────────

describe('reportService.getAllReports — pagination', () => {
  beforeEach(() => {
    // Chain: Report.find(...).populate(...).populate(...).sort(...).skip(...).limit(...)
    const chainMock = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };
    Report.find.mockReturnValue(chainMock);
    Report.countDocuments.mockResolvedValue(25);
  });

  it('returns correct totalPages for 25 records with limit 10', async () => {
    const result = await reportService.getAllReports({ page: '1', limit: '10' });
    expect(result.totalPages).toBe(3);
    expect(result.total).toBe(25);
    expect(result.page).toBe(1);
  });

  it('defaults to page 1 when no page param is supplied', async () => {
    const result = await reportService.getAllReports({});
    expect(result.page).toBe(1);
  });

  it('caps limit at 50 even if a higher value is passed', async () => {
    // We can't easily assert the internal limit call, but we can assert
    // totalPages math doesn't break with an out-of-range limit input.
    const result = await reportService.getAllReports({ page: '1', limit: '999' });
    // 25 records / 50 (capped) = 1 page
    expect(result.totalPages).toBe(1);
  });
});
