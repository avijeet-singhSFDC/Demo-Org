trigger autoFollowParentRecords on AssignedResource (after insert, before delete, before update) {
    if (Trigger.isInsert) {
        FSAutoFollowHelper.follow(Trigger.new);
    } else if (Trigger.isDelete) {
        FSAutoFollowHelper.unfollow(Trigger.old);
    } else if (Trigger.isUpdate) {
        FSAutoFollowHelper.updateFollow(Trigger.oldMap, Trigger.new);
    }
}