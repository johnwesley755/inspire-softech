const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { superAdminOnly } = require('../middleware/roleMiddleware');
const {
  getAllSellers,
  approveSeller,
  rejectSeller,
  suspendSeller,
  updateCommission,
  getPlatformStats
} = require('../controllers/superAdminController');

// All routes require super admin authentication
router.use(protect);
router.use(superAdminOnly);

router.get('/sellers', getAllSellers);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/reject', rejectSeller);
router.put('/sellers/:id/suspend', suspendSeller);
router.put('/sellers/:id/commission', updateCommission);
router.get('/stats', getPlatformStats);

module.exports = router;
